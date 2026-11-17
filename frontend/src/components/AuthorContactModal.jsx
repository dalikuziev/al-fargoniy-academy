import React, { useState } from 'react';
import { X, PhoneCall, Send, Copy, Check, User } from 'lucide-react';

export default function AuthorContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const phoneNumber = '+998992166020';
  const displayPhone = '+998 99 216 60 20';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Bog'lanish</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Al-Farg'oniy Academy</p>
            </div>
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
          {/* Ism va Nomer kartochkasi */}
          <div className="text-center py-3.5 px-4 bg-gradient-to-br from-indigo-50/60 via-blue-50/40 to-slate-50 dark:from-slate-800 dark:via-indigo-950/40 dark:to-slate-800 rounded-xl border border-indigo-100/80 dark:border-indigo-800/60">
            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-wide font-serif">
              Diyorbek Aliqo'ziyev
            </h4>
            <div className="mt-2.5 inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 tracking-wider">
                {displayPhone}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Raqamni nusxalash"
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 animate-fade-in">
                Raqam nusxalandi!
              </p>
            )}
          </div>

          {/* Harakatlar (Telefon qilish & Telegram) */}
          <div className="grid grid-cols-1 gap-2.5">
            <a
              href="tel:+998992166020"
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-sm shadow-emerald-500/20 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Qo'ng'iroq Qilish</span>
            </a>

            <a
              href="https://t.me/dalikuziev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-98 text-white font-bold text-sm shadow-sm shadow-sky-500/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Telegram orqali yozish</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
