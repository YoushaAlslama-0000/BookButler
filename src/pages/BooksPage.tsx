import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, Percent, RefreshCw, Search, X } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { useApp } from '../context/AppContext';
import { booksApi, categoriesApi } from '../services/api';
import type { Book, Category } from '../types';

export function BooksPage() {
  const { currentPath } = useApp();
  const initialParams = new URLSearchParams(window.location.search);

  const [search, setSearch] = useState(initialParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialParams.get('categoryId') || ''
  );
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(
    initialParams.get('discounted') === 'true'
  );

  useEffect(() => {
    const queryStr = currentPath.includes('?') ? currentPath.split('?')[1] : '';
    const params = new URLSearchParams(queryStr);
    const catParam = params.get('categoryId');
    const discParam = params.get('discounted');
    const searchParam = params.get('search');
    if (catParam !== null) setSelectedCategoryId(catParam);
    if (discParam !== null) setOnlyDiscounted(discParam === 'true');
    if (searchParam !== null) {
      setSearch(searchParam);
      setDebouncedSearch(searchParam);
    }
  }, [currentPath]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    categoriesApi
      .list()
      .then((list) => setCategories(list))
      .catch(() => {
        // Categories filter falls back cleanly if unavailable
      });
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await booksApi.list({
        search: debouncedSearch || undefined,
        categoryId: selectedCategoryId || undefined,
        discounted: onlyDiscounted || undefined,
      });
      setBooks(list);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'تعذر تحميل قائمة الكتب'
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategoryId, onlyDiscounted]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategoryId('');
    setOnlyDiscounted(false);
  };

  const hasActiveFilters = Boolean(
    search || selectedCategoryId || onlyDiscounted
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#001D51]/12 dark:border-[#F1EBE3]/12">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            مكتبة الكتب
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            ابحث بالاسم أو الوصف، وفلتر الكتب حسب النوع أو الحسومات المتاحة.
          </p>
        </div>

        <div className="text-sm font-medium font-mono-num text-[#001D51]/70 dark:text-[#F1EBE3]/70">
          {loading ? 'جاري البحث...' : `${books.length} كتاب`}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن كتاب بالاسم أو الوصف..."
              className="w-full ps-11 pe-10 py-3 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#FAF7F2] dark:bg-[#001334]/80 text-[#001D51] dark:text-[#F1EBE3] placeholder:text-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="مسح البحث"
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#001D51] dark:hover:text-[#F1EBE3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Discount Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setOnlyDiscounted((prev) => !prev)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              onlyDiscounted
                ? 'bg-[#ff5c40] text-white border-[#ff5c40]'
                : 'bg-[#FAF7F2] dark:bg-[#001334]/80 text-[#001D51] dark:text-[#F1EBE3] border-[#001D51]/15 dark:border-[#F1EBE3]/15 hover:border-[#ff5c40]'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>الكتب المخفضة فقط</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium border border-[#001D51]/15 dark:border-[#F1EBE3]/15 text-[#001D51]/80 dark:text-[#F1EBE3]/80 hover:bg-[#001D51]/5 dark:hover:bg-[#F1EBE3]/10 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                selectedCategoryId === ''
                  ? 'bg-[#001D51] text-[#F1EBE3] border-[#001D51] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:border-[#F1EBE3]'
                  : 'bg-[#FAF7F2] dark:bg-[#001334]/70 text-[#001D51]/80 dark:text-[#F1EBE3]/80 border-[#001D51]/12 dark:border-[#F1EBE3]/12 hover:border-[#001D51]/40 dark:hover:border-[#F1EBE3]/40'
              }`}
            >
              جميع الأنواع
            </button>
            {categories.map((cat) => {
              const active = selectedCategoryId === String(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategoryId(active ? '' : String(cat.id))
                  }
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    active
                      ? 'bg-[#001D51] text-[#F1EBE3] border-[#001D51] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:border-[#F1EBE3]'
                      : 'bg-[#FAF7F2] dark:bg-[#001334]/70 text-[#001D51]/80 dark:text-[#F1EBE3]/80 border-[#001D51]/12 dark:border-[#F1EBE3]/12 hover:border-[#001D51]/40 dark:hover:border-[#F1EBE3]/40'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-xl border border-[#ff5c40]/40 bg-[#ff5c40]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm font-medium text-[#001D51] dark:text-[#F1EBE3]">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchBooks}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      )}

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-[460px] rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/10 bg-[#FAF7F2]/60 dark:bg-[#001334]/50 animate-pulse"
            />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        !error && (
          <div className="p-14 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/70 dark:bg-[#001334]/60 text-center space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-[#737373]" />
            <h2 className="text-lg font-bold text-[#001D51] dark:text-[#F1EBE3]">
              لم يتم العثور على كتب مطابقة
            </h2>
            <p className="text-sm text-[#001D51]/70 dark:text-[#F1EBE3]/70">
              جرب تغيير كلمات البحث أو إزالة الفلاتر المحددة.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer"
              >
                عرض جميع الكتب
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}
