import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, isDarkMode } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-[#D64545] shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#6366F1] shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border transition-all flex items-start gap-2.5 animate-in slide-in-from-right-5 ${
              isDarkMode
                ? 'bg-[#071A2F] border-slate-700 text-white'
                : 'bg-white border-slate-200 text-[#17212B]'
            }`}
          >
            {icons[toast.type]}
            <div className="grow min-w-0">
              <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
