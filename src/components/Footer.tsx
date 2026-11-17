import React from 'react';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export function Footer() {
  const { navigate, storeConfig, supportUrl } = useApp();
  const { isDark } = useTheme();

  return (
    <footer className="mt-20 border-t border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#E9E1D6]/70 dark:bg-[#000B21]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <img
              src={
                isDark
                  ? '/assets/logos/book_logo_w.jpg'
                  : '/assets/logos/book_logo_b.jpg'
              }
              alt="شعار Book Butler"
              className="w-12 h-12 rounded-xl object-cover border border-[#001D51]/15 dark:border-[#F1EBE3]/20 shrink-0 mt-0.5"
            />
            <div>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="font-display text-2xl font-bold text-[#001D51] dark:text-[#F1EBE3] cursor-pointer"
              >
                {storeConfig.storeName || 'Book Butler'}
              </button>
              <p className="mt-1 text-sm text-[#001D51]/70 dark:text-[#F1EBE3]/70 max-w-md">
                متجرك المتخصص لاقتناء الكتب المختارة والترشيحات الأسبوعية والشهرية.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[#001D51]/80 dark:text-[#F1EBE3]/80 hover:text-[#001D51] dark:hover:text-[#F1EBE3] cursor-pointer"
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="text-[#001D51]/80 dark:text-[#F1EBE3]/80 hover:text-[#001D51] dark:hover:text-[#F1EBE3] cursor-pointer"
            >
              تصفح الكتب
            </button>
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="text-[#001D51]/80 dark:text-[#F1EBE3]/80 hover:text-[#001D51] dark:hover:text-[#F1EBE3] cursor-pointer"
            >
              سلة المشتريات
            </button>
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#001D51] dark:text-[#F1EBE3] hover:text-[#ff5c40] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>دعم واتساب</span>
            </a>
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="inline-flex items-center gap-1.5 text-[#001D51]/70 dark:text-[#F1EBE3]/70 hover:text-[#001D51] dark:hover:text-[#F1EBE3] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>بوابة المشرف</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#001D51]/60 dark:text-[#F1EBE3]/60">
          <span>
            © {new Date().getFullYear()}{' '}
            <span className="font-butler font-semibold">Book Butler</span>. جميع
            الحقوق محفوظة.
          </span>
          <span>
            تطوير شركة{' '}
            <span className="font-butler font-semibold text-[#001D51]/85 dark:text-[#F1EBE3]/85">
              Butler
            </span>{' '}
            للخدمات البرمجية وأفكار سوق العمل
          </span>
        </div>
      </div>
    </footer>
  );
}
