import React, { useState } from 'react';
import { BookOpen, Heart, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getBookImageUrl } from '../services/api';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  badgeText?: string;
}

export function BookCard({ book, badgeText }: BookCardProps) {
  const { navigate, favoriteIds, toggleFavorite, addToCart } = useApp();
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

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

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await addToCart(book, 1);
    } finally {
      setAdding(false);
    }
  };

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(book);
  };

  return (
    <article
      onClick={() => navigate(`/books/${book.id}`)}
      className="group flex flex-col rounded-xl overflow-hidden border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75 transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Cover Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E7DFD3] dark:bg-[#000B21]">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={book.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#001D51] via-[#001334] to-[#072761] text-[#F1EBE3]">
            <BookOpen className="w-10 h-10 mb-3 opacity-80" />
            <span className="font-display text-lg font-bold leading-snug line-clamp-3">
              {book.title}
            </span>
            <span className="mt-2 text-xs font-mono-num opacity-65">
              #{book.id}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && discountPct > 0 && (
          <div className="absolute top-3 start-3 px-2.5 py-1 rounded-md bg-[#ff5c40] text-white text-xs font-bold font-mono-num shadow-sm">
            خصم {discountPct}%
          </div>
        )}

        {/* Optional Pick Label */}
        {badgeText && (
          <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded-md bg-[#001D51]/90 dark:bg-[#F1EBE3]/95 text-[#F1EBE3] dark:text-[#001D51] text-xs font-semibold">
            {badgeText}
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFav}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          className="absolute top-3 end-3 w-9 h-9 rounded-lg flex items-center justify-center bg-[#FAF7F2]/95 dark:bg-[#001334]/90 border border-[#001D51]/10 dark:border-[#F1EBE3]/15 transition-transform duration-150 hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c40]"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{
              color: isFav ? '#ff5c40' : '#737373',
              fill: isFav ? '#ff5c40' : 'transparent',
            }}
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-base font-bold leading-snug text-[#001D51] dark:text-[#F1EBE3] line-clamp-1">
            {book.title}
          </h3>
          <span className="text-xs font-mono-num text-[#001D51]/55 dark:text-[#F1EBE3]/55 shrink-0 pt-0.5">
            #{book.id}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-[#001D51]/75 dark:text-[#F1EBE3]/75 line-clamp-2 mb-3">
          {book.description || 'كتاب مختار بعناية من مكتبة Book Butler.'}
        </p>

        {/* Categories Tags */}
        {book.categories && book.categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {book.categories.map((cat) => (
              <span
                key={cat.id || cat.name}
                className="px-2 py-0.5 text-xs font-medium rounded border border-[#001D51]/15 dark:border-[#F1EBE3]/20 text-[#001D51]/80 dark:text-[#F1EBE3]/80"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action Footer */}
        <div className="mt-auto pt-3 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-base font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-mono-num line-through text-[#737373]">
                  ${book.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                ${book.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 bg-[#001D51] text-[#F1EBE3] hover:bg-[#072761] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:hover:bg-[#E7DFD3] disabled:opacity-60"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{adding ? 'جاري الإضافة...' : 'إضافة إلى السلة'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
