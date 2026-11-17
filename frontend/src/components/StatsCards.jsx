import React from 'react';
import { Users, CheckCircle, AlertTriangle, UserCheck, ShieldCheck, Banknote } from 'lucide-react';

export default function StatsCards({ summary, loading, isLoggedIn = false }) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0) + " so'm";
  };

  const total = summary?.total_students || 0;
  const paidCount = summary?.paid_count || 0;
  const unpaidCount = summary?.unpaid_count || 0;
  const teacherCount = summary?.taken_by_teacher_count || 0;
  const adminCount = summary?.taken_by_admin_count || 0;

  const paidPercentage = total > 0 ? Math.round((paidCount / total) * 100) : 0;
  const unpaidPercentage = total > 0 ? Math.round((unpaidCount / total) * 100) : 0;
  const teacherPercentage = total > 0 ? Math.round((teacherCount / total) * 100) : 0;
  const adminPercentage = total > 0 ? Math.round((adminCount / total) * 100) : 0;

  return (
    <div className={`grid gap-2.5 sm:gap-4 ${
      isLoggedIn 
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' 
        : 'grid-cols-1 sm:grid-cols-3'
    }`}>
      {/* 1. Jami O'quvchilar */}
      <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Jami O'quvchilar</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {loading ? '...' : total}
          </div>
        </div>
        <div className="w-full bg-indigo-100 dark:bg-indigo-950/40 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div className="bg-indigo-600 dark:bg-indigo-500 h-full w-full rounded-full" />
        </div>
      </div>

      {/* 2. To'landi */}
      <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/60 shadow-xs hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">To'landi</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {loading ? '...' : paidCount}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              {paidPercentage}%
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, paidPercentage)}%` }}
          />
        </div>
      </div>

      {/* 3. To'lanmadi */}
      <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-rose-100 dark:border-rose-950/60 shadow-xs hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">To'lanmadi</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              {loading ? '...' : unpaidCount}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
              {unpaidPercentage}%
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-rose-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, unpaidPercentage)}%` }}
          />
        </div>
      </div>

      {/* Faqat login qilganda ko'rinadigan qism: Domla oldi, Admin oldi, Yig'ilgan tushim */}
      {isLoggedIn && (
        <>
          {/* 4. Domla oldi */}
          <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-blue-100 dark:border-blue-950/60 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Domla oldi</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                  {loading ? '...' : teacherCount}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                  {teacherPercentage}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, teacherPercentage)}%` }}
              />
            </div>
          </div>

          {/* 5. Admin oldi */}
          <div className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-purple-100 dark:border-purple-950/60 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">Admin oldi</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                  {loading ? '...' : adminCount}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded">
                  {adminPercentage}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, adminPercentage)}%` }}
              />
            </div>
          </div>

          {/* 6. Yig'ilgan Summa - mobil ekranlarda 2 ustunni to'liq qoplab, juda chiroyli va keng ko'rinadi */}
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-3.5 sm:p-4 rounded-2xl shadow-sm border border-indigo-700/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-indigo-200 mb-1.5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Yig'ilgan tushim</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 tracking-tight">
                {loading ? '...' : formatMoney(summary?.total_collected_sum)}
              </div>
            </div>

            {/* Pastki qism: Jami kutilgan tushim qirqilmasdan (truncatesiz) toza chiqadi */}
            <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="text-slate-400">Jami kutilgan:</span>
                <span className="font-bold text-white whitespace-nowrap">
                  {loading ? '...' : formatMoney(summary?.total_expected_sum)}
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, paidPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
