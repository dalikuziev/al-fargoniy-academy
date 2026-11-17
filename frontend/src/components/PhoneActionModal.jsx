import React from 'react';
import { X, PhoneCall, Send, ExternalLink } from 'lucide-react';

export default function PhoneActionModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;

  // Telefon raqamini tozalash (faqat raqamlar va +)
  const rawDigits = student.phone.replace(/[^\d+]/g, '');
  const cleanPhone = rawDigits.startsWith('+') ? rawDigits : `+${rawDigits}`;
  const telegramUrl = `https://t.me/${cleanPhone}`;
  const telUrl = `tel:${cleanPhone}`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Bog'lanish</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[220px]">
              {student.full_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="text-center py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="text-lg font-black text-slate-800 dark:text-white tracking-wide font-mono">
              {student.phone}
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Amalni tanlang:</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Qo'ng'iroq qilish */}
            <a
              href={telUrl}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-sm shadow-emerald-500/20 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Telefon Qilish</span>
            </a>

            {/* Telegram orqali ochish */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-98 text-white font-bold text-sm shadow-sm shadow-sky-500/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Telegram orqali ochish</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
