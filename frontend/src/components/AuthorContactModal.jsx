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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Bog'lanish</h3>
              <p className="text-[11px] text-slate-500 font-medium">Al-Farg'oniy Academy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Ism va Nomer kartochkasi */}
          <div className="text-center py-3.5 px-4 bg-gradient-to-br from-indigo-50/60 via-blue-50/40 to-slate-50 rounded-xl border border-indigo-100/80">
            <h4 className="text-lg font-black text-slate-900 tracking-wide font-serif">
              Diyorbek Aliqo'ziyev
            </h4>
            <div className="mt-2.5 inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
              <span className="text-sm font-bold font-mono text-slate-800 tracking-wider">
                {displayPhone}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Raqamdan nusxa olish"
                className="p-1 text-slate-400 hover:text-indigo-600 rounded transition cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Nusxa olindi!</p>
            )}
          </div>

          {/* Amal tugmalari */}
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {/* Telefon qilish */}
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-sm shadow-emerald-500/20 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Telefon Qilish</span>
            </a>

            {/* Telegram orqali ochish */}
            <a
              href={`https://t.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-98 text-white font-bold text-sm shadow-sm shadow-sky-500/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Telegramda Ochish</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-1 px-3 cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
