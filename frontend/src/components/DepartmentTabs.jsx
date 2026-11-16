import React from 'react';
import { Search, UserPlus, BookOpen, Building2, Filter } from 'lucide-react';

const MODULES = ['Dasturlash asoslari', 'Telegram bot', 'Web site'];

export default function DepartmentTabs({
  departments,
  selectedBranchId,
  setSelectedBranchId,
  selectedModule,
  setSelectedModule,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  totalStudentsCount,
  isLoggedIn = false,
  onPromptLogin,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      {/* 1-qator: Filiallar (Yangiqo'rg'on / Uchko'prik) va Yangi O'quvchi Qo'shish */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filial Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedBranchId(null)}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
              selectedBranchId === null
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Barcha Filiallar</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[11px] bg-slate-200/80 text-slate-700">
              {totalStudentsCount}
            </span>
          </button>

          {departments.map((dept) => {
            const isSelected = selectedBranchId === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedBranchId(dept.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{dept.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                    isSelected
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {dept.students_count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Yangi o'quvchi qo'shish */}
        <button
          onClick={isLoggedIn ? onOpenAddModal : onPromptLogin}
          title={isLoggedIn ? "Yangi o'quvchi qo'shish" : "O'quvchi qo'shish uchun tizimga kiring"}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold transition shadow-sm shadow-indigo-500/25 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Yangi O'quvchi Qo'shish</span>
        </button>
      </div>

      {/* 2-qator: Modullar (Dasturlash asoslari / Telegram bot / Web site), Status Filter va Qidiruv */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Modullar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mr-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modul:</span>
          </div>

          <button
            onClick={() => setSelectedModule(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              selectedModule === null
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Barcha modullar
          </button>

          {MODULES.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod === selectedModule ? null : mod)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedModule === mod
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        {/* O'ng tomon: Status Filter va Qidiruv */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-7 pr-7 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
            >
              <option value="all">Barcha holatlar</option>
              <option value="paid">✅ Faqat To'langanlar</option>
              <option value="unpaid">❌ Faqat Qarzdorlar</option>
              <option value="admin">🏢 Admin olganlar</option>
              <option value="teacher">👨‍🏫 Domla olganlar</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Qidiruv */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ism yoki telefon qidirish..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
