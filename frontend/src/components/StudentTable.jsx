import React from 'react';
import { Check, X, Edit2, History, Lock } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full mb-3" />
        <p className="text-slate-500 font-medium text-sm">O'quvchilar ro'yxati yuklanmoqda...</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
        <p className="text-slate-500 font-medium text-sm">
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Telegram bot':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Web site':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/80">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">Ism, Familya</th>
              {isLoggedIn && <th className="py-3.5 px-4">Telefon</th>}
              <th className="py-3.5 px-4">Filial</th>
              <th className="py-3.5 px-4">Modul</th>
              <th className="py-3.5 px-4 text-center">Oylik To'lov</th>
              {isLoggedIn && <th className="py-3.5 px-4 text-center">Kim oldi?</th>}
              {isLoggedIn && <th className="py-3.5 px-4 text-center w-28">Amallar</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {students.map((student, index) => {
              const payment = student.latest_payment;
              const isPaid = Boolean(payment?.is_paid);
              const isTeacher = Boolean(payment?.is_taken_by_teacher);
              // Agar to'langan bo'lsa: default admin
              const currentRecipient = isTeacher ? 'domla' : 'admin';
              const isToggling = togglingIds.has(student.id);
              const amount = payment?.amount || 250000;

              return (
                <tr
                  key={student.id}
                  className={`hover:bg-indigo-50/20 transition-colors ${
                    isPaid ? 'bg-white' : 'bg-rose-50/10'
                  }`}
                >
                  {/* # */}
                  <td className="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Ism, Familya */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {student.full_name}
                  </td>

                  {/* Telefon - faqat login qilganlarga ko'rinadi */}
                  {isLoggedIn && (
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenPhoneAction(student)}
                        title="Qo'ng'iroq qilish yoki Telegramdan ochish"
                        className="font-medium text-slate-700 hover:text-indigo-600 hover:underline cursor-pointer transition text-xs sm:text-sm font-mono"
                      >
                        {student.phone}
                      </button>
                    </td>
                  )}

                  {/* Filial */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200/80">
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
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 shadow-rose-500/5'
                          }`}
                        >
                          {isToggling ? (
                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : isPaid ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          <span>{isPaid ? "To'langan" : "To'lanmadi"}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onPromptLogin}
                          title="To'lov holatini o'zgartirish uchun tizimga kiring"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer hover:opacity-80 transition ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {isPaid ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          <span>{isPaid ? "To'langan" : "To'lanmadi"}</span>
                        </button>
                      )}

                      {/* To'lov summasi */}
                      <span className="text-[11px] font-semibold text-slate-500">
                        {formatMoney(amount)}
                      </span>
                    </div>
                  </td>

                  {/* Kim oldi? - faqat login qilganlarga ko'rinadi */}
                  {isLoggedIn && (
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {!isPaid ? (
                        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-xl select-none">
                          —
                        </span>
                      ) : (
                        <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/70 text-xs font-bold">
                          {/* Admin */}
                          <button
                            type="button"
                            onClick={() => onSwitchRecipient(student, payment, 'admin')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currentRecipient === 'admin'
                                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Admin
                          </button>

                          {/* Domla */}
                          <button
                            type="button"
                            onClick={() => onSwitchRecipient(student, payment, 'domla')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currentRecipient === 'domla'
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                                : 'text-slate-500 hover:text-slate-800'
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
                        {/* To'lovlar tarixi */}
                        <button
                          onClick={() => onOpenHistory(student)}
                          title="To'lovlar tarixi"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        {/* Tahrirlash */}
                        <button
                          onClick={() => onOpenEditStudent(student)}
                          title="O'quvchini tahrirlash"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
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

      {/* Table Footer */}
      <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Jami ko'rsatilmoqda: {students.length} nafar o'quvchi</span>
        <span>Al-Farg'oniy Academy</span>
      </div>
    </div>
  );
}
