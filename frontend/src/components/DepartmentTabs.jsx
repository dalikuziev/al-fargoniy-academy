import React from 'react';
import { Search, UserPlus, Building2, Filter } from 'lucide-react';

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
  canEdit = true,
  onPromptLogin,
  onPromptReadOnly,
}) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4 transition-colors">
      {/* 1-qator: Filiallar (Yangiqo'rg'on / Uchko'prik) va Yangi O'quvchi Qo'shish */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Filial Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-900/80 rounded-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedBranchId(null)}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
              selectedBranchId === null
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Barcha Filiallar</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[11px] bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {totalStudentsCount}
            </span>
          </button>

          {departments.map((dept) => {
            const isSelected = selectedBranchId === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedBranchId(dept.id)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span>{dept.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                    isSelected
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                      : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
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
          onClick={
            !isLoggedIn
              ? onPromptLogin
              : canEdit
              ? onOpenAddModal
              : onPromptReadOnly
          }
          title={
            !isLoggedIn
              ? "O'quvchi qo'shish uchun tizimga kiring"
              : canEdit
              ? "Yangi o'quvchi qo'shish"
              : "Siz faqat ko'rish rejimidasiz"
          }
          className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold transition shadow-sm whitespace-nowrap shrink-0 ${
            !canEdit && isLoggedIn
              ? 'bg-slate-400 dark:bg-slate-700 opacity-60 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-500/25 cursor-pointer'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Yangi O'quvchi Qo'shish</span>
        </button>
      </div>

      {/* 2-qator: Modullar (Dasturlash asoslari / Telegram bot / Web site), Status Filter va Qidiruv */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
        {/* Modullar - "Modul:" yozuvi va kitobcha olib tashlangan, "Barcha modullar" eng boshida */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setSelectedModule(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              selectedModule === null
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        {/* O'ng tomon: Status Filter va Qidiruv */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-2 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition border border-transparent dark:border-slate-600 lowercase"
            >
              <option value="all" className="dark:bg-slate-800">jami o'quvchilar</option>
              <option value="paid" className="dark:bg-slate-800">to'landi</option>
              <option value="unpaid" className="dark:bg-slate-800">to'lanmadi</option>
              <option value="admin" className="dark:bg-slate-800">admin oldi</option>
              <option value="teacher" className="dark:bg-slate-800">domla oldi</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Qidiruv */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ism yoki telefon qidirish..."
              className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
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
