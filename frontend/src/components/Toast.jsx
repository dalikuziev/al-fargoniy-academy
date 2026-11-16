import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in shadow-2xl">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
          isSuccess
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-500/10'
            : isError
            ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-rose-500/10'
            : 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-indigo-500/10'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
        
        <p className="flex-1">{toast.message}</p>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
