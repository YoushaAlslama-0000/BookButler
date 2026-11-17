import React, { useEffect } from 'react';
import { BookOpen, Heart, LogIn } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { useApp } from '../context/AppContext';

export function FavoritesPage() {
  const { userToken, favorites, refreshFavorites, navigate } = useApp();

  useEffect(() => {
    if (userToken) {
      refreshFavorites();
    }
  }, [userToken, refreshFavorites]);

  if (!userToken) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-10 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75 space-y-4">
          <Heart className="w-10 h-10 mx-auto text-[#ff5c40]" />
          <h1 className="font-display text-2xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            سجل الدخول لعرض المفضلة
          </h1>
          <p className="text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            قم بتسجيل الدخول لحفظ الكتب التي تود قراءتها والرجوع إليها في أي وقت.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#001D51]/20 dark:border-[#F1EBE3]/20 text-[#001D51] dark:text-[#F1EBE3] cursor-pointer"
            >
              حساب جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#001D51]/12 dark:border-[#F1EBE3]/12">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            الكتب المفضلة
          </h1>
          <p className="mt-1.5 text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            قائمة الكتب التي أضفتها إلى مفضلتك الشخصية.
          </p>
        </div>
        <span className="text-sm font-mono-num font-semibold text-[#001D51]/70 dark:text-[#F1EBE3]/70">
          {favorites.length} كتاب
        </span>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="p-14 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/70 dark:bg-[#001334]/60 text-center space-y-4">
          <BookOpen className="w-10 h-10 mx-auto text-[#737373]" />
          <h2 className="text-lg font-bold text-[#001D51] dark:text-[#F1EBE3]">
            قائمة المفضلة فارغة حالياً
          </h2>
          <p className="text-sm text-[#001D51]/70 dark:text-[#F1EBE3]/70">
            تصفح مكتبة Book Butler واضغط على أيقونة القلب لحفظ كتبك المفضلة.
          </p>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer"
          >
            استكشف الكتب
          </button>
        </div>
      )}
    </div>
  );
}
