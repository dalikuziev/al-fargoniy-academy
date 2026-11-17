import React from 'react';
import { Check, X, Edit2, History, Phone } from 'lucide-react';

export default function StudentTable({
  students,
  loading,
  selectedMonth,
  isLoggedIn = false,
  onPromptLogin,
  onQuickTogglePayment,
  onSwitchRecipient,
  onOpenEditStudent,
  onOpenHistory,
  onOpenPhoneAction,
  togglingIds = new Set(),
}) {
  if (loading && (!students || students.length === 0)) {
    return (
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center shadow-sm">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full mb-3" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">O'quvchilar ro'yxati yuklanmoqda...</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center shadow-sm">
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          Tanlangan filial yoki modul bo'yicha ma'lumot mavjud emas.
        </p>
      </div>
    );
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0) + " so'm";
  };

  const getModuleBadge = (moduleName) => {
    switch (moduleName) {
      case 'Dasturlash asoslari':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Telegram bot':
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'Web site':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
  };

  return (
    <div className="w-full max-w-full">
      {/* ======================================================== */}
      {/* 1. MOBIL KARTA REJIMI (Telefonlar uchun chiroyli ilova)  */}
      {/* Har bir o'quvchi alohida nafis kartochkada ko'rinadi    */}
      {/* ======================================================== */}
      <div className="md:hidden space-y-3">
        {students.map((student, index) => {
          const payment = student.latest_payment;
          const isPaid = Boolean(payment?.is_paid);
          const isTeacher = Boolean(payment?.is_taken_by_teacher);
          const currentRecipient = isTeacher ? 'domla' : 'admin';
          const isToggling = togglingIds.has(student.id);
          const amount = payment?.amount || 300000;

          return (
            <div
              key={student.id}
              className={`rounded-2xl border p-4 shadow-xs transition-all space-y-3 ${
                isPaid
                  ? 'bg-white dark:bg-slate-800/95 border-slate-200/90 dark:border-slate-700/80'
                  : 'bg-rose-50/20 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-900/40'
              }`}
            >
              {/* Yuqori qator: Tartib raqam, Ism, Filial va Harakatlar */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50 shadow-xs">
                    #{index + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight truncate">
                      {student.full_name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {student.department_name || "Yangiqo'rg'on"}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getModuleBadge(student.module || student.group_time)}`}>
                        {student.module || student.group_time || 'Dasturlash asoslari'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* O'ng yuqori: Amallar (Tarix va Tahrirlash) */}
                {isLoggedIn && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpenHistory(student)}
                      title="To'lovlar tarixi"
                      className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenEditStudent(student)}
                      title="Tahrirlash"
                      className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Telefon raqami tugmasi */}
              {student.phone && (
                <button
                  type="button"
                  onClick={() => onOpenPhoneAction(student)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50 dark:hover:bg-slate-700/60 border border-slate-200/70 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{student.phone}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">Bog'lanish →</span>
                </button>
              )}

              {/* Pastki qator: To'lov summasi va Katta To'lov tugmasi */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    Oylik to'lov:
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {formatMoney(amount)}
                  </span>
                </div>

                {/* To'lov tugmasi */}
                {isLoggedIn ? (
                  <button
                    onClick={() => onQuickTogglePayment(student.id)}
                    disabled={isToggling}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer ${
                      isPaid
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {isToggling ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isPaid ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    <span>{isPaid ? "To'landi" : "To'lanmadi"}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onPromptLogin}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      isPaid
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {isPaid ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    <span>{isPaid ? "To'landi" : "To'lanmadi"}</span>
                  </button>
                )}
              </div>

              {/* Agar to'langan bo'lsa va login qilingan bo'lsa: Kim oldi? (Admin | Domla) tanlash paneli */}
              {isLoggedIn && isPaid && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    To'lovni kim oldi?
                  </span>
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => onSwitchRecipient(student, payment, 'admin')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        currentRecipient === 'admin'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => onSwitchRecipient(student, payment, 'domla')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        currentRecipient === 'domla'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Domla
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP / TABLET JADVAL REJIMI (md va undan katta)    */}
      {/* ======================================================== */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">Ism, Familya</th>
              <th className="py-3.5 px-4">Telefon</th>
              <th className="py-3.5 px-4">Filial</th>
              <th className="py-3.5 px-4">Modul</th>
              <th className="py-3.5 px-4 text-center">Oylik To'lov</th>
              {isLoggedIn && <th className="py-3.5 px-4 text-center">Kim oldi?</th>}
              {isLoggedIn && <th className="py-3.5 px-4 text-center w-28">Amallar</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
            {students.map((student, index) => {
              const payment = student.latest_payment;
              const isPaid = Boolean(payment?.is_paid);
              const isTeacher = Boolean(payment?.is_taken_by_teacher);
              const currentRecipient = isTeacher ? 'domla' : 'admin';
              const isToggling = togglingIds.has(student.id);
              const amount = payment?.amount || 300000;

              return (
                <tr
                  key={student.id}
                  className={`hover:bg-indigo-50/20 dark:hover:bg-slate-700/30 transition-colors ${
                    isPaid
                      ? 'bg-white dark:bg-slate-800/90'
                      : 'bg-rose-50/15 dark:bg-rose-950/15'
                  }`}
                >
                  {/* # */}
                  <td className="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Ism, Familya */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {student.full_name}
                  </td>

                  {/* Telefon */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenPhoneAction(student)}
                      title="Qo'ng'iroq qilish yoki Telegramdan ochish"
                      className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer transition text-xs sm:text-sm font-mono"
                    >
                      {student.phone}
                    </button>
                  </td>

                  {/* Filial */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600">
                      {student.department_name || "Yangiqo'rg'on"}
                    </span>
                  </td>

                  {/* Modul */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getModuleBadge(
                        student.module || student.group_time
                      )}`}
                    >
                      {student.module || student.group_time || 'Dasturlash asoslari'}
                    </span>
                  </td>

                  {/* Oylik To'lov */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center gap-1">
                      {isLoggedIn ? (
                        <button
                          onClick={() => onQuickTogglePayment(student.id)}
                          disabled={isToggling}
                          title={isPaid ? "To'lovni bekor qilish" : "To'lovni qabul qilish"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 ${
                            isPaid
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                              : 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          {isToggling ? (
                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : isPaid ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          <span>{isPaid ? "To'landi" : "To'lanmadi"}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onPromptLogin}
                          title="To'lov holatini o'zgartirish uchun tizimga kiring"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer hover:opacity-80 transition ${
                            isPaid
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {isPaid ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          <span>{isPaid ? "To'landi" : "To'lanmadi"}</span>
                        </button>
                      )}

                      {/* To'lov summasi */}
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {formatMoney(amount)}
                      </span>
                    </div>
                  </td>

                  {/* Kim oldi? - faqat login qilganlarga ko'rinadi */}
                  {isLoggedIn && (
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {!isPaid ? (
                        <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/60 px-3 py-1 rounded-xl select-none">
                          —
                        </span>
                      ) : (
                        <div className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-700 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => onSwitchRecipient(student, payment, 'admin')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currentRecipient === 'admin'
                                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                          >
                            Admin
                          </button>

                          <button
                            type="button"
                            onClick={() => onSwitchRecipient(student, payment, 'domla')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currentRecipient === 'domla'
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                          >
                            Domla
                          </button>
                        </div>
                      )}
                    </td>
                  )}

                  {/* Amallar - faqat login qilganlarga ko'rinadi */}
                  {isLoggedIn && (
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenHistory(student)}
                          title="To'lovlar tarixi"
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenEditStudent(student)}
                          title="O'quvchini tahrirlash"
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer text */}
      <div className="px-4 py-3 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
        Jami {students.length} nafar o'quvchi
      </div>
    </div>
  );
}
