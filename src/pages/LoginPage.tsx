import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { navigate, loginUser, supportUrl } = useApp();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !password) {
      setError('يرجى إدخال الاسم الثلاثي وكلمة المرور.');
      return;
    }

    setSubmitting(true);
    try {
      await loginUser(fullName.trim(), password);
      navigate('/');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'فشل تسجيل الدخول. تأكد من الاسم الثلاثي وكلمة المرور.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="p-7 sm:p-10 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/80 space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            تسجيل الدخول
          </h1>
          <p className="text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            أدخل الاسم الثلاثي وكلمة المرور للوصول إلى مفضلتك وسلة مشترياتك.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-[#ff5c40] bg-[#ff5c40]/12 space-y-3">
            <p className="text-sm font-semibold text-[#ff5c40]">{error}</p>
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#ff5c40] text-white hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل مع الدعم عبر واتساب</span>
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="login-fullname"
              className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]"
            >
              الاسم الثلاثي
            </label>
            <input
              id="login-fullname"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: أحمد محمد العلي"
              className="w-full px-4 py-3 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-[#001D51] dark:text-[#F1EBE3] placeholder:text-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]"
            >
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-4 pe-11 py-3 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-[#001D51] dark:text-[#F1EBE3] placeholder:text-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#001D51] dark:hover:text-[#F1EBE3] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] hover:bg-[#072761] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:hover:bg-[#E7DFD3] transition-colors cursor-pointer disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'جاري تسجيل الدخول...' : 'دخول'}</span>
          </button>
        </form>

        <div className="pt-5 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-semibold text-[#001D51] dark:text-[#F1EBE3] hover:text-[#ff5c40] transition-colors cursor-pointer"
          >
            ليس لديك حساب؟ إنشاء حساب جديد
          </button>

          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#ff5c40] hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل مع الدعم</span>
          </a>
        </div>
      </div>
    </div>
  );
}
