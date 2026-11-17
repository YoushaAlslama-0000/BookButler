import React, { useEffect } from 'react';
import {
  BookOpen,
  Heart,
  LogIn,
  LogOut,
  Mail,
  ShoppingBag,
  Trash2,
  User as UserIcon,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getBookImageUrl } from '../services/api';

export function ProfilePage() {
  const {
    userToken,
    user,
    isUserLoading,
    favorites,
    cart,
    toggleFavorite,
    logoutUser,
    refreshUserProfile,
    refreshFavorites,
    navigate,
  } = useApp();

  useEffect(() => {
    if (userToken) {
      refreshUserProfile();
      refreshFavorites();
    }
  }, [userToken, refreshUserProfile, refreshFavorites]);

  if (!userToken) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-10 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75 space-y-5">
          <UserIcon className="w-10 h-10 mx-auto text-[#001D51] dark:text-[#F1EBE3]" />
          <h1 className="font-display text-2xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            الملف الشخصي
          </h1>
          <p className="text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            سجل الدخول أو أنشئ حساباً جديداً لعرض بياناتك الشخصية وقائمة كتبك المفضلة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#001D51]/20 dark:border-[#F1EBE3]/20 text-[#001D51] dark:text-[#F1EBE3] cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartCount = cart.itemsCount ?? cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Card */}
      <section className="p-6 sm:p-8 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#001D51] dark:bg-[#F1EBE3] text-[#F1EBE3] dark:text-[#001D51] flex items-center justify-center shrink-0">
            <UserIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
              {isUserLoading ? 'جاري التحميل...' : user?.fullName || 'قارئ Book Butler'}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
              {user?.email && (
                <span className="inline-flex items-center gap-1.5" dir="ltr">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
              )}
              {user?.id && (
                <span className="font-mono-num text-xs opacity-75">
                  عضو #{user.id}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logoutUser}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#ff5c40]/50 text-[#ff5c40] hover:bg-[#ff5c40]/10 transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </section>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => navigate('/favorites')}
          className="p-5 rounded-xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/80 dark:bg-[#001334]/70 flex items-center justify-between text-start hover:border-[#001D51]/30 dark:hover:border-[#F1EBE3]/30 transition-colors cursor-pointer"
        >
          <div>
            <p className="text-xs font-medium text-[#001D51]/65 dark:text-[#F1EBE3]/65">
              الكتب المفضلة
            </p>
            <p className="text-2xl font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3] mt-1">
              {favorites.length}
            </p>
          </div>
          <Heart className="w-6 h-6 text-[#ff5c40]" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="p-5 rounded-xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/80 dark:bg-[#001334]/70 flex items-center justify-between text-start hover:border-[#001D51]/30 dark:hover:border-[#F1EBE3]/30 transition-colors cursor-pointer"
        >
          <div>
            <p className="text-xs font-medium text-[#001D51]/65 dark:text-[#F1EBE3]/65">
              عناصر سلة المشتريات
            </p>
            <p className="text-2xl font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3] mt-1">
              {cartCount}
            </p>
          </div>
          <ShoppingBag className="w-6 h-6 text-[#001D51] dark:text-[#F1EBE3]" />
        </button>
      </div>

      {/* Favorites Management Section */}
      <section className="p-6 sm:p-8 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            قائمة المفضلة السريعة
          </h2>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="text-sm font-semibold text-[#ff5c40] hover:underline cursor-pointer"
          >
            إضافة كتب أخرى
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-[#737373]" />
            <p className="text-sm text-[#001D51]/70 dark:text-[#F1EBE3]/70">
              لا توجد كتب في قائمة المفضلة حالياً.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#001D51]/10 dark:divide-[#F1EBE3]/10">
            {favorites.map((book) => {
              const cover = getBookImageUrl(book.image);
              const price = book.finalPrice ?? book.price;
              return (
                <div
                  key={book.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="flex items-center gap-4 min-w-0 cursor-pointer"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#E7DFD3] dark:bg-[#000B21] shrink-0 flex items-center justify-center">
                      {cover ? (
                        <img
                          src={cover}
                          alt={book.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-5 h-5 text-[#737373]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base text-[#001D51] dark:text-[#F1EBE3] truncate">
                        {book.title}
                      </p>
                      <p className="text-xs font-mono-num text-[#001D51]/70 dark:text-[#F1EBE3]/70 mt-0.5">
                        #{book.id} · ${price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(book)}
                    aria-label={`إزالة ${book.title} من المفضلة`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#ff5c40] hover:bg-[#ff5c40]/10 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">إزالة</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
