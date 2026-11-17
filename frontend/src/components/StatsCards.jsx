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
    <div className={`grid gap-3 sm:gap-4 ${
      isLoggedIn 
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' 
        : 'grid-cols-1 sm:grid-cols-3'
    }`}>
      {/* 1. Jami O'quvchilar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Jami O'quvchilar</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {loading ? '...' : total}
          </div>
        </div>
      </div>

      {/* 2. To'landi */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/60 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">To'landi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {loading ? '...' : paidCount}
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
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
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-rose-100 dark:border-rose-950/60 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">To'lanmadi</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {loading ? '...' : unpaidCount}
            </span>
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
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
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-blue-100 dark:border-blue-950/60 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">Domla oldi</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {loading ? '...' : teacherCount}
                </span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
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
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-purple-100 dark:border-purple-950/60 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">Admin oldi</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                  {loading ? '...' : adminCount}
                </span>
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded">
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

          {/* 6. Yig'ilgan Summa */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 dark:from-indigo-950 dark:to-slate-950 text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition border border-indigo-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-indigo-200 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Yig'ilgan tushim</span>
                <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 truncate">
                {loading ? '...' : formatMoney(summary?.total_collected_sum)}
              </div>
            </div>
            <div className="text-[11px] text-slate-300 mt-2 truncate">
              Jami kutilgan tushim: {formatMoney(summary?.total_expected_sum)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
