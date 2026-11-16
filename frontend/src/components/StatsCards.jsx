import React from 'react';
import { Users, CheckCircle, AlertTriangle, UserCheck, ShieldCheck, Banknote } from 'lucide-react';

export default function StatsCards({ summary, loading }) {
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0) + " so'm";
  };

  const percentage = summary?.collection_percentage || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Jami O'quvchilar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Jami O'quvchi</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {loading ? '...' : summary?.total_students ?? 0}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Ro'yxatdagi barcha o'quvchilar</p>
      </div>

      {/* 2. To'langanlar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">To'langan</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-600">
            {loading ? '...' : summary?.paid_count ?? 0}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>

      {/* 3. Qarzdorlar */}
      <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">Qarzdorlar</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-rose-600">
          {loading ? '...' : summary?.unpaid_count ?? 0}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">To'lov qilmaganlar</p>
      </div>

      {/* 4. Domla oldi */}
      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Domla oldi</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-blue-600">
          {loading ? '...' : summary?.taken_by_teacher_count ?? 0}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Ustoz qabul qilgan</p>
      </div>

      {/* 5. Admin oldi */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">Admin oldi</span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-purple-600">
          {loading ? '...' : summary?.taken_by_admin_count ?? 0}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Ma'muriyat qabul qilgan</p>
      </div>

      {/* 6. Yig'ilgan Summa */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between text-indigo-200 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Yig'ilgan tushum</span>
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
    </div>
  );
}
