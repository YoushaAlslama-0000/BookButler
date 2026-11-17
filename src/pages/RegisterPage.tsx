import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function RegisterPage() {
  const { navigate, registerUser } = useApp();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const words = fullName.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) {
      setError('يجب أن يتكون الاسم الثلاثي من 3 مقاطع على الأقل.');
      return;
    }

    if (password.length < 6) {
      setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({
        email: email.trim(),
        fullName: fullName.trim(),
        password,
        confirmPassword,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'تعذر إنشاء الحساب. حاول مجدداً.'
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
            إنشاء حساب جديد
          </h1>
          <p className="text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            سجل حسابك في Book Butler لحفظ كتبك المفضلة وإتمام طلباتك بسهولة.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-[#ff5c40] bg-[#ff5c40]/12">
            <p className="text-sm font-semibold text-[#ff5c40]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="reg-email"
              className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]"
            >
              البريد الإلكتروني
            </label>
            <input
              id="reg-email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-[#001D51] dark:text-[#F1EBE3] placeholder:text-[#737373] text-sm text-end focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reg-fullname"
              className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]"
            >
              الاسم الثلاثي
            </label>
            <input
              id="reg-fullname"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="الاسم الأول الأب الكنية (3 مقاطع على الأقل)"
              className="w-full px-4 py-3 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-[#001D51] dark:text-[#F1EBE3] placeholder:text-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reg-password"
              className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]"
            >
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="reg-password"
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

          <div className="space-y-1.5">
            <label
              htmlFor="reg-confirm"
              className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]"
            >
              تأكيد كلمة المرور
            </label>
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-[#001D51] dark:text-[#F1EBE3] placeholder:text-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] hover:bg-[#072761] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:hover:bg-[#E7DFD3] transition-colors cursor-pointer disabled:opacity-60"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</span>
          </button>
        </form>

        <div className="pt-5 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10 text-center text-sm">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-[#001D51] dark:text-[#F1EBE3] hover:text-[#ff5c40] transition-colors cursor-pointer"
          >
            لديك حساب بالفعل؟ تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
}
