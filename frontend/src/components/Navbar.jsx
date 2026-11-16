import React from 'react';
import { RefreshCw, Calendar, PhoneCall, Send, LogIn, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({
  selectedMonth,
  setSelectedMonth,
  onRefresh,
  loading,
  onOpenAuthorContact,
  user,
  onOpenLogin,
  onLogout,
}) {
  const months = [
    { value: '2026-09', label: '2026-Sentabr' },
    { value: '2026-10', label: '2026-Oktyabr' },
    { value: '2026-11', label: '2026-Noyabr' },
    { value: '2026-12', label: '2026-Dekabr' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-950 flex items-center justify-center p-1.5 shadow-md shadow-blue-500/10 ring-1 ring-slate-800">
              <img
                src="/logo.png"
                alt="Al-Farg'oniy Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent tracking-tight">
                Al-Farg'oniy Academy
              </h1>
            </div>
          </div>

          {/* O'rta: Diyorbek Aliqo'ziyev */}
          <div className="flex-1 flex items-center justify-center px-2">
            <button
              type="button"
              onClick={onOpenAuthorContact}
              title="Diyorbek Aliqo'ziyev bilan bog'lanish (Telefon / Telegram)"
              className="group px-4 sm:px-6 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50 to-blue-50/80 hover:from-blue-100 hover:via-indigo-100 hover:to-blue-100 border border-indigo-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2 sm:gap-2.5"
            >
              <span className="text-sm sm:text-lg md:text-xl font-black tracking-wide bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 group-hover:from-blue-800 group-hover:to-indigo-800 bg-clip-text text-transparent select-none font-serif">
                Diyorbek Aliqo'ziyev
              </span>
              <div className="hidden md:flex items-center gap-1 opacity-60 group-hover:opacity-100 transition text-indigo-600 pl-1">
                <PhoneCall className="w-3.5 h-3.5" />
                <Send className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Month Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs sm:text-sm font-medium">
              <Calendar className="w-4 h-4 ml-1.5 text-slate-500 hidden xs:block" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1 py-1"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Ma'lumotlarni qayta yuklash"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition shadow-sm active:scale-95 flex items-center gap-1.5 text-xs sm:text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">Yangilash</span>
            </button>

            {/* Login / Logout Tugmalari */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{user.name || 'Admin'}</span>
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Tizimdan chiqish"
                  className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 hover:text-rose-800 transition active:scale-95 flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Chiqish</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                title="Tizimga kirish"
                className="px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-sm shadow-indigo-500/25 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Kirish</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
