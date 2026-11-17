import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AdminLoginPage() {
  const { adminToken, loginAdmin, navigate } = useApp();
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminToken) {
      navigate('/admin/dashboard');
    }
  }, [adminToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return;
    }

    setSubmitting(true);
    try {
      await loginAdmin(username.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'بيانات دخول المشرف غير صحيحة.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="p-7 sm:p-10 rounded-2xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#FAF7F2] dark:bg-[#001334]/85 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#001D51] dark:bg-[#F1EBE3] text-[#F1EBE3] dark:text-[#001D51] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
              دخول المشرف العام
            </h1>
            <p className="text-xs text-[#001D51]/70 dark:text-[#F1EBE3]/70">
              لوحة إدارة متجر Book Butler
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-[#ff5c40] bg-[#ff5c40]/12">
            <p className="text-sm font-semibold text-[#ff5c40]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-username"
              className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]"
            >
              اسم المستخدم
            </label>
            <input
              id="admin-username"
              type="text"
              required
              dir="ltr"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="superadmin"
              className="w-full px-4 py-3 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-[#001D51] dark:text-[#F1EBE3] text-sm text-end focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]"
            >
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-4 pe-11 py-3 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-[#001D51] dark:text-[#F1EBE3] text-sm text-end focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
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
            <ShieldCheck className="w-4 h-4" />
            <span>{submitting ? 'جاري التحقق...' : 'دخول إلى لوحة التحكم'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10 text-xs text-[#001D51]/65 dark:text-[#F1EBE3]/65 flex items-center justify-between gap-2">
          <span>حساب المشرف الافتراضي: superadmin</span>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-semibold text-[#001D51] dark:text-[#F1EBE3] hover:underline cursor-pointer"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    </div>
  );
}
