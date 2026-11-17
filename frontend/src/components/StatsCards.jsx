import React from 'react';
import { Users, CheckCircle, AlertTriangle, UserCheck, ShieldCheck, Banknote } from 'lucide-react';

export default function StatsCards({ summary, loading, isLoggedIn = false }) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0) + " so'm";
  };

  const percentage = summary?.collection_percentage || 0;

  return (
    <div className={`grid gap-3 sm:gap-4 ${
      isLoggedIn 
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' 
        : 'grid-cols-1 sm:grid-cols-3'
    }`}>
      {/* 1. Jami O'quvchilar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Jami O'quvchi</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">
          {loading ? '...' : summary?.total_students ?? 0}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Ro'yxatdagi barcha o'quvchilar</p>
      </div>

      {/* 2. To'langanlar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/60 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">To'langan</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {loading ? '...' : summary?.paid_count ?? 0}
          </span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>

      {/* 3. Qarzdorlar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-rose-100 dark:border-rose-950/60 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">Qarzdorlar</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
          {loading ? '...' : summary?.unpaid_count ?? 0}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">To'lov qilmaganlar</p>
      </div>

      {/* Faqat login qilganda ko'rinadigan qism: Domla oldi, Admin oldi, Yig'ilgan tushim */}
      {isLoggedIn && (
        <>
          {/* 4. Domla oldi */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-blue-100 dark:border-blue-950/60 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">Domla oldi</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {loading ? '...' : summary?.taken_by_teacher_count ?? 0}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Ustoz qabul qilgan</p>
          </div>

          {/* 5. Admin oldi */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-purple-100 dark:border-purple-950/60 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">Admin oldi</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {loading ? '...' : summary?.taken_by_admin_count ?? 0}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Ma'muriyat qabul qilgan</p>
          </div>

          {/* 6. Yig'ilgan Summa */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 dark:from-indigo-950 dark:to-slate-950 text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition border border-indigo-800/40">
            <div className="flex items-center justify-between text-indigo-200 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Yig'ilgan tushim</span>
              <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-400 truncate">
              {loading ? '...' : formatMoney(summary?.total_collected_sum)}
            </div>
            <div className="text-[10px] text-slate-300 mt-1 truncate">
              Kutilgan: {formatMoney(summary?.total_expected_sum)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
