import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all transform duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border ${
          isSuccess
            ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300 glow-emerald'
            : 'bg-slate-900/90 border-rose-500/40 text-rose-300'
        } backdrop-blur-md min-w-[300px] max-w-md`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        )}
        <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
