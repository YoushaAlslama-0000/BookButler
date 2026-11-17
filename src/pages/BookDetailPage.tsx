import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { booksApi, getBookImageUrl } from '../services/api';
import type { Book } from '../types';

export function BookDetailPage({ bookId }: { bookId: string }) {
  const { navigate, favoriteIds, toggleFavorite, addToCart } = useApp();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const loadBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await booksApi.getById(bookId);
      setBook(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل تفاصيل الكتاب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 aspect-[3/4] rounded-2xl bg-[#FAF7F2]/60 dark:bg-[#001334]/50 animate-pulse" />
          <div className="md:col-span-7 space-y-4">
            <div className="h-10 w-2/3 rounded-lg bg-[#FAF7F2]/60 dark:bg-[#001334]/50 animate-pulse" />
            <div className="h-28 w-full rounded-lg bg-[#FAF7F2]/60 dark:bg-[#001334]/50 animate-pulse" />
            <div className="h-14 w-1/2 rounded-lg bg-[#FAF7F2]/60 dark:bg-[#001334]/50 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-base font-bold text-[#ff5c40]">
          {error || 'الكتاب غير موجود'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={loadBook}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#001D51]/20 dark:border-[#F1EBE3]/20 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للكتب</span>
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getBookImageUrl(book.image);
  const isFav = favoriteIds.has(book.id);
  const discountPct = Number(book.discountPercentage || 0);
  const hasDiscount = Boolean(book.hasDiscount) || discountPct > 0;
  const finalPrice =
    book.finalPrice !== undefined
      ? book.finalPrice
      : hasDiscount
      ? Number((book.price * (1 - discountPct / 100)).toFixed(2))
      : book.price;

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(book, quantity);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        type="button"
        onClick={() => navigate('/books')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#001D51]/75 dark:text-[#F1EBE3]/75 hover:text-[#001D51] dark:hover:text-[#F1EBE3] mb-6 cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى مكتبة الكتب</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Book Cover */}
        <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#E7DFD3] dark:bg-[#000B21] aspect-[3/4]">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={book.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#001D51] via-[#001334] to-[#072761] text-[#F1EBE3]">
              <BookOpen className="w-12 h-12 mb-4 opacity-80" />
              <span className="font-display text-2xl font-bold leading-snug">
                {book.title}
              </span>
              <span className="mt-2 text-sm font-mono-num opacity-70">
                #{book.id}
              </span>
            </div>
          )}

          {hasDiscount && discountPct > 0 && (
            <div className="absolute top-4 start-4 px-3 py-1.5 rounded-lg bg-[#ff5c40] text-white text-xs font-bold font-mono-num shadow-sm">
              خصم {discountPct}%
            </div>
          )}
        </div>

        {/* Contiguous Purchase Module */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-num text-[#001D51]/65 dark:text-[#F1EBE3]/65">
            <span>الرقم التعريفي: #{book.id}</span>
            {book.isWeeklyPick && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-sans font-semibold text-[#ff5c40]">
                  ترشيح الأسبوع
                </span>
              </>
            )}
            {book.isMonthlyPick && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-sans font-semibold text-[#ff5c40]">
                  ترشيح الشهر
                </span>
              </>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#001D51] dark:text-[#F1EBE3] leading-tight">
            {book.title}
          </h1>

          <p className="text-base leading-relaxed text-[#001D51]/85 dark:text-[#F1EBE3]/85 whitespace-pre-line">
            {book.description}
          </p>

          {/* Categories */}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {book.categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigate(`/books?categoryId=${cat.id}`)}
                  className="px-3 py-1 text-xs font-semibold rounded border border-[#001D51]/15 dark:border-[#F1EBE3]/20 text-[#001D51] dark:text-[#F1EBE3] hover:border-[#ff5c40] transition-colors cursor-pointer"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Price Block */}
          <div className="pt-4 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10">
            {hasDiscount ? (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-lg font-mono-num line-through text-[#737373]">
                  ${book.price.toFixed(2)}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#ff5c40] text-white text-xs font-bold font-mono-num">
                  وفر {discountPct}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                ${book.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/20 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="إنقاص الكمية"
                className="w-10 h-11 inline-flex items-center justify-center text-[#001D51] dark:text-[#F1EBE3] cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="زيادة الكمية"
                className="w-10 h-11 inline-flex items-center justify-center text-[#001D51] dark:text-[#F1EBE3] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] hover:bg-[#072761] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:hover:bg-[#E7DFD3] transition-colors cursor-pointer disabled:opacity-60"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{adding ? 'جاري الإضافة...' : 'إضافة إلى السلة'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(book)}
              aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                isFav
                  ? 'border-[#ff5c40] text-[#ff5c40] bg-[#ff5c40]/10'
                  : 'border-[#001D51]/15 dark:border-[#F1EBE3]/20 text-[#001D51] dark:text-[#F1EBE3] hover:border-[#ff5c40]'
              }`}
            >
              <Heart
                className="w-4 h-4"
                style={{
                  color: isFav ? '#ff5c40' : 'currentColor',
                  fill: isFav ? '#ff5c40' : 'transparent',
                }}
              />
              <span>{isFav ? 'في المفضلة' : 'مفضلة'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
