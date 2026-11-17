import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 start-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2.5rem)]"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : Info;

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-sm font-medium transition-all duration-200 ${
              toast.type === 'error'
                ? 'bg-[#ff5c40] text-white border-[#ff5c40]'
                : toast.type === 'success'
                ? 'bg-[#001D51] text-[#F1EBE3] border-[#F1EBE3]/20 dark:bg-[#F1EBE3] dark:text-[#001D51]'
                : 'bg-[#FAF7F2] text-[#001D51] border-[#001D51]/15 dark:bg-[#001334] dark:text-[#F1EBE3] dark:border-[#F1EBE3]/15'
            }`}
          >
            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="flex-1 leading-snug">{toast.text}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="إغلاق التنبيه"
              className="opacity-75 hover:opacity-100 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
