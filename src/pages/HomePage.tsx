import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Briefcase, Code2, Lightbulb, RefreshCw } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { booksApi } from '../services/api';
import type { Book } from '../types';

export function HomePage() {
  const { navigate, storeConfig } = useApp();
  const { isDark } = useTheme();
  const [weeklyPicks, setWeeklyPicks] = useState<Book[]>([]);
  const [monthlyPicks, setMonthlyPicks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await booksApi.getRecommendations();
      setWeeklyPicks(data.weeklyPicks);
      setMonthlyPicks(data.monthlyPicks);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'تعذر تحميل الترشيحات من الخادم'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const aboutText =
    storeConfig.about ||
    storeConfig.description ||
    'مكتبة Book Butler هي وجهتك الهادئة لاقتناء أرقى الإصدارات العربية والمترجمة. ننتقي لك أسبوعياً وشهرياً أعمالاً تستحق القراءة مع خدمة طلب سريعة ومباشرة.';

  return (
    <div className="space-y-20 pb-8">
      {/* Hero & About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-between p-7 sm:p-10 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    isDark
                      ? '/assets/logos/book_w.png'
                      : '/assets/logos/book_b.png'
                  }
                  alt="Book Butler"
                  className="w-14 h-14 object-contain shrink-0"
                />
                <p className="text-xs font-semibold tracking-wide text-[#ff5c40]">
                  مختارات أدبية وعلمية منتقاة بعناية
                </p>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-[#001D51] dark:text-[#F1EBE3] [text-wrap:balance]">
                {storeConfig.storeName || 'Book Butler'} — رفيقك الدائم في عالم القراءة
              </h1>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#001D51]/80 dark:text-[#F1EBE3]/80 max-w-xl">
                {aboutText}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] hover:bg-[#072761] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:hover:bg-[#E7DFD3] transition-colors cursor-pointer"
              >
                <span>تصفح جميع الكتب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/books?discounted=true')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-[#ff5c40]/40 text-[#ff5c40] hover:bg-[#ff5c40]/10 transition-colors cursor-pointer"
              >
                <span>عروض الحسومات</span>
              </button>
            </div>
          </div>

          {/* Hero Photography Column */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#001D51]/12 dark:border-[#F1EBE3]/12 min-h-[320px] lg:min-h-[440px]">
            <img
              src="/src/assets/images/hero_bookstore_editorial_1794898525681.jpg"
              alt="مجموعة كتب مختارة من متجر Book Butler"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000B21]/75 via-[#000B21]/15 to-transparent" />
            <div className="absolute bottom-6 inset-x-6 flex items-end justify-between gap-4 text-[#F1EBE3]">
              <div>
                <p className="text-xs opacity-80">إصدارات مختارة</p>
                <p className="font-display text-xl sm:text-2xl font-bold mt-0.5">
                  عناية فائقة بكل عنوان يصل إلى مكتبتك
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-8 border-y border-[#001D51]/12 dark:border-[#F1EBE3]/12">
          <div className="md:col-span-5 rounded-xl overflow-hidden border border-[#001D51]/10 dark:border-[#F1EBE3]/10 aspect-[4/3]">
            <img
              src="/src/assets/images/about_book_butler_1794898525802.jpg"
              alt="تفاصيل الكتب في Book Butler"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-7 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
              لماذا يختار القراء Book Butler؟
            </h2>
            <p className="text-base leading-relaxed text-[#001D51]/80 dark:text-[#F1EBE3]/80">
              نجمع بين التنوع المعرفي وسهولة الوصول. سواء كنت تبحث عن روايات الخيال العلمي، قصص الغموض، الأدب الرومانسي، أو كتب الإثارة والأكشن، ستجد قائمة متجددة مع ترشيحات أسبوعية وشهرية وإمكانية إتمام الطلب مباشرة عبر واتساب.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/70 dark:bg-[#001334]/50">
                <p className="text-sm font-bold text-[#001D51] dark:text-[#F1EBE3]">
                  ترشيحات متجددة
                </p>
                <p className="mt-1 text-xs text-[#001D51]/70 dark:text-[#F1EBE3]/70">
                  قوائم أسبوعية وشهرية من فريق القراءة
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/70 dark:bg-[#001334]/50">
                <p className="text-sm font-bold text-[#001D51] dark:text-[#F1EBE3]">
                  حسومات واضحة
                </p>
                <p className="mt-1 text-xs text-[#001D51]/70 dark:text-[#F1EBE3]/70">
                  توفير فوري مع حساب دقيق للسعر النهائي
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/70 dark:bg-[#001334]/50">
                <p className="text-sm font-bold text-[#001D51] dark:text-[#F1EBE3]">
                  طلب مباشر عبر واتساب
                </p>
                <p className="mt-1 text-xs text-[#001D51]/70 dark:text-[#F1EBE3]/70">
                  تأكيد فوري لسلة مشترياتك بضغطة زر
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Butler Company Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-7 sm:p-10 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75">
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/12 bg-[#F1EBE3]/70 dark:bg-[#000B21]/60">
            <img
              src={
                isDark
                  ? '/assets/logos/book_w.png'
                  : '/assets/logos/book_b.png'
              }
              alt="شعار شركة Butler"
              className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
            />
            <span className="mt-3 font-butler text-xl font-bold tracking-wide text-[#001D51] dark:text-[#F1EBE3]">
              Butler
            </span>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#ff5c40] mb-2">
                تعريف بالشركة المطوّرة
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
                شركة <span className="font-butler">Butler</span> للخدمات البرمجية
              </h2>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-[#001D51]/80 dark:text-[#F1EBE3]/80">
                شركة <span className="font-butler font-bold">Butler</span> هي شركة تجمع الخدمات البرمجية لسوق العمل وتطرح أفكاراً وحلولاً مبتكرة في سوق العمل، لتقديم منصات وتجارب رقمية عملية تواكب تطلعات المؤسسات والأفراد.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/12 bg-[#F1EBE3]/55 dark:bg-[#000B21]/50 space-y-2">
                <Code2 className="w-5 h-5 text-[#ff5c40]" />
                <p className="text-sm font-bold text-[#001D51] dark:text-[#F1EBE3]">
                  خدمات برمجية متكاملة
                </p>
                <p className="text-xs leading-relaxed text-[#001D51]/70 dark:text-[#F1EBE3]/70">
                  تطوير أنظمة ومنصات ويب حديثة مصممة خصيصاً لمتطلبات سوق العمل.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/12 bg-[#F1EBE3]/55 dark:bg-[#000B21]/50 space-y-2">
                <Lightbulb className="w-5 h-5 text-[#ff5c40]" />
                <p className="text-sm font-bold text-[#001D51] dark:text-[#F1EBE3]">
                  طرح أفكار في سوق العمل
                </p>
                <p className="text-xs leading-relaxed text-[#001D51]/70 dark:text-[#F1EBE3]/70">
                  مبادرات وأفكار تقنية مبتكرة تساهم في تطوير بيئة الأعمال ورفع كفاءتها.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/12 bg-[#F1EBE3]/55 dark:bg-[#000B21]/50 space-y-2">
                <Briefcase className="w-5 h-5 text-[#ff5c40]" />
                <p className="text-sm font-bold text-[#001D51] dark:text-[#F1EBE3]">
                  تجربة مستخدم متقنة
                </p>
                <p className="text-xs leading-relaxed text-[#001D51]/70 dark:text-[#F1EBE3]/70">
                  الجمع بين وضوح التصميم وسلاسة الأداء لخدمة القراء ورواد الأعمال.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Notice for Recommendations */}
      {error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl border border-[#ff5c40]/40 bg-[#ff5c40]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm text-[#001D51] dark:text-[#F1EBE3]">
                تعذر الاتصال بخادم الكتب
              </p>
              <p className="text-sm text-[#001D51]/80 dark:text-[#F1EBE3]/80 mt-0.5">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={loadRecommendations}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </section>
      )}

      {/* Weekly Picks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-[#ff5c40] mb-1">
              اختيارات الأسبوع
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
              الترشيحات الأسبوعية
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3] hover:text-[#ff5c40] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span>عرض كل الكتب</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[460px] rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/10 bg-[#FAF7F2]/60 dark:bg-[#001334]/50 animate-pulse"
              />
            ))}
          </div>
        ) : weeklyPicks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyPicks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                badgeText="ترشيح الأسبوع"
              />
            ))}
          </div>
        ) : (
          !error && (
            <div className="p-10 rounded-xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/60 dark:bg-[#001334]/50 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-[#737373]" />
              <p className="text-sm font-medium text-[#001D51]/75 dark:text-[#F1EBE3]/75">
                لا توجد ترشيحات أسبوعية مضافة حالياً.
              </p>
            </div>
          )
        )}
      </section>

      {/* Monthly Picks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-[#ff5c40] mb-1">
              اختيارات الشهر
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
              الترشيحات الشهرية
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3] hover:text-[#ff5c40] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <span>استكشف المكتبة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[460px] rounded-xl border border-[#001D51]/10 dark:border-[#F1EBE3]/10 bg-[#FAF7F2]/60 dark:bg-[#001334]/50 animate-pulse"
              />
            ))}
          </div>
        ) : monthlyPicks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyPicks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                badgeText="ترشيح الشهر"
              />
            ))}
          </div>
        ) : (
          !error && (
            <div className="p-10 rounded-xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/60 dark:bg-[#001334]/50 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-[#737373]" />
              <p className="text-sm font-medium text-[#001D51]/75 dark:text-[#F1EBE3]/75">
                لا توجد ترشيحات شهرية مضافة حالياً.
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
