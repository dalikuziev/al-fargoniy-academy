import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, PhoneCall, Send, LogIn, LogOut, ShieldCheck, Sun, Moon } from 'lucide-react';

export const UZ_MONTH_NAMES = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

/**
 * O'zbekiston vaqti (Asia/Tashkent, UTC+5) bo'yicha joriy sanani olish
 * Masalan: { day: '19', month: '11', year: '2026', formattedDate: '19-11-2026', monthKey: '2026-11' }
 */
export const getUzbekistanDateInfo = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const day = parts.find((p) => p.type === 'day')?.value || '19';
  const month = parts.find((p) => p.type === 'month')?.value || '11';
  const year = parts.find((p) => p.type === 'year')?.value || '2026';

  const formattedDate = `${day}-${month}-${year}`; // Masalan: "19-11-2026"
  const monthKey = `${year}-${month}`;             // Masalan: "2026-11"

  return { day, month, year, formattedDate, monthKey };
};

export const getCurrentMonth = () => {
  return getUzbekistanDateInfo().monthKey;
};

export const getAvailableMonths = () => {
  const uzInfo = getUzbekistanDateInfo();
  const currentYear = Number(uzInfo.year);
  const currentMonth = Number(uzInfo.month);

  const startYear = 2026;
  const startMonth = 11; // 2026-Noyabr boshlang'ich

  // Keyingi 1 oyni ham ro'yxatga qo'shamiz (foydalanuvchi xohlagan payt oldindan o'tib ko'rishi uchun)
  let maxYear = currentYear;
  let maxMonth = currentMonth + 1;
  if (maxMonth > 12) {
    maxMonth = 1;
    maxYear += 1;
  }

  const months = [];
  let y = startYear;
  let m = startMonth;

  while (y < maxYear || (y === maxYear && m <= maxMonth)) {
    const val = `${y}-${String(m).padStart(2, '0')}`;
    const isCurrent = val === uzInfo.monthKey;
    const isPast = y < currentYear || (y === currentYear && m < currentMonth);

    let label;
    if (isCurrent) {
      // Joriy oyda bugungi sana: masalan "19-11-2026"
      label = uzInfo.formattedDate;
    } else {
      // O'tgan yoki kelgusi oy: masalan "2026-Noyabr" yoki "2026-Dekabr"
      label = `${y}-${UZ_MONTH_NAMES[m - 1]}`;
    }

    months.push({ value: val, label, isCurrent, isPast });

    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }

  return months;
};

export default function Navbar({
  selectedMonth,
  setSelectedMonth,
  isDark,
  onToggleTheme,
  onOpenAuthorContact,
  user,
  onOpenLogin,
  onLogout,
}) {
  const [currentDateInfo, setCurrentDateInfo] = useState(() => getUzbekistanDateInfo());

  // Har 30 sekundda O'zbekiston vaqtini yangilab turish (yarim kechasi 00:00 da sana avtomatik yangilanishi uchun)
  useEffect(() => {
    const timer = setInterval(() => {
      const latest = getUzbekistanDateInfo();
      if (latest.formattedDate !== currentDateInfo.formattedDate) {
        if (selectedMonth === currentDateInfo.monthKey && latest.monthKey !== currentDateInfo.monthKey) {
          setSelectedMonth(latest.monthKey);
        }
        setCurrentDateInfo(latest);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [currentDateInfo, selectedMonth, setSelectedMonth]);

  const months = useMemo(() => {
    const list = getAvailableMonths();
    // Agar tanlangan oy ro'yxatda bo'lmasa, uni ham qo'shib qo'yamiz
    if (!list.some((item) => item.value === selectedMonth)) {
      const [y, m] = selectedMonth.split('-').map(Number);
      const mName = UZ_MONTH_NAMES[m - 1] || m;
      list.push({ value: selectedMonth, label: `${y}-${mName}` });
    }
    return list;
  }, [selectedMonth, currentDateInfo.formattedDate]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-1.5 sm:gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-slate-950 flex items-center justify-center p-1 sm:p-1.5 shadow-md shadow-blue-500/10 ring-1 ring-slate-800 shrink-0">
              <img
                src="/logo.png"
                alt="Al-Farg'oniy Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                Al-Farg'oniy <span className="hidden xs:inline">Academy</span>
              </h1>
            </div>
          </div>

          {/* O'rta: Diyorbek Aliqo'ziyev */}
          <div className="flex-1 flex items-center justify-center px-1 sm:px-2 min-w-0">
            <button
              type="button"
              onClick={onOpenAuthorContact}
              title="Diyorbek Aliqo'ziyev bilan bog'lanish"
              className="group px-2.5 sm:px-5 py-1 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50 to-blue-50/90 dark:from-slate-800 dark:via-indigo-950/60 dark:to-slate-800 hover:from-blue-100 dark:hover:from-slate-700/80 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 truncate"
            >
              <span className="text-xs sm:text-base lg:text-lg font-black tracking-wide bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent select-none font-serif truncate">
                Diyorbek Aliqo'ziyev
              </span>
              <div className="hidden md:flex items-center gap-1 opacity-60 group-hover:opacity-100 transition text-indigo-600 dark:text-indigo-400 pl-0.5">
                <PhoneCall className="w-3.5 h-3.5" />
                <Send className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {/* O'ng tomon boshqaruvlar */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Kalendar sanasi / Oy tanlagich (Dynamic Month & Today Date Selector) */}
            <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm font-semibold">
              <Calendar className="w-3.5 h-3.5 ml-1 text-slate-500 dark:text-slate-400 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                title="Sana / Hisobot oyi (O'zbekiston vaqti)"
                className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer pr-1 py-0.5 sm:py-1 text-xs sm:text-sm"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value} className="dark:bg-slate-800 dark:text-white">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Qora va Oq Fon tugmasi (Dark / Light Mode Toggle) */}
            <button
              onClick={onToggleTheme}
              type="button"
              title={isDark ? "Yorug' (Oq) rejimga o'tish" : "Qorong'i (Qora) rejimga o'tish"}
              className="p-1.5 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Login / Logout Tugmalari */}
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{(user.name || 'Administrator').replace(/\s*\([Kk]o['`ʼ]rish\)/gi, '').trim()}</span>
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Tizimdan chiqish"
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 transition active:scale-95 flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Chiqish</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                title="Tizimga kirish"
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold shadow-sm shadow-indigo-500/25 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Kirish</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
