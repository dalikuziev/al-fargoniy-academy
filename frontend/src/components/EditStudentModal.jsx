import React, { useState, useEffect } from 'react';
import { X, UserCheck, Phone, BookOpen, Building2, Banknote, Trash2 } from 'lucide-react';

const MODULES = ['Dasturlash asoslari', 'Telegram bot', 'Web site'];

export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  departments,
  onUpdateStudent,
  onDeleteStudent,
  onUpdatePaymentAmount,
}) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('300000');
  const [departmentId, setDepartmentId] = useState(1);
  const [module, setModule] = useState(MODULES[0]);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (student) {
      setFullName(student.full_name || '');
      setPhone(student.phone || '');
      setAmount(String(student.latest_payment?.amount || 300000));
      setDepartmentId(student.department_id || 1);
      setModule(student.module || student.group_time || MODULES[0]);
      setIsActive(student.is_active ?? true);
      setConfirmDelete(false);
      setPhoneError('');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+')) {
      val = '+' + val.replace(/[^\d]/g, '');
    } else {
      val = '+' + val.slice(1).replace(/[^\d]/g, '');
    }
    if (val.length > 13) {
      val = val.slice(0, 13);
    }
    setPhone(val);
    if (phoneError) setPhoneError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Telefon raqamini qat'iy tekshirish: roppa-rosa 13 ta belgi (+998911530608)
    const phoneRegex = /^\+998\d{9}$/;
    if (phone.length !== 13 || !phoneRegex.test(phone)) {
      setPhoneError("Telefon raqami +998 bilan boshlanishi va roppa-rosa 13 ta belgi bo'lishi shart! (Masalan: +998911530608)");
      return;
    }
    setPhoneError('');

    if (!fullName.trim()) return;

    try {
      setSubmitting(true);
      const parsedAmount = parseFloat(amount) || 300000;
      await onUpdateStudent(student.id, {
        full_name: fullName.trim(),
        phone: phone.trim(),
        department_id: Number(departmentId),
        module: module,
        group_time: module,
        is_active: isActive,
      });

      // Agar to'lov summasi o'zgargan bo'lsa
      if (onUpdatePaymentAmount && student.latest_payment?.id) {
        await onUpdatePaymentAmount(student.latest_payment.id, parsedAmount);
      }

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await onDeleteStudent(student.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">O'quvchini Tahrirlash</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Ism, Familya */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Ism, Familya *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Telefon Raqami *
            </label>
            <input
              type="text"
              required
              maxLength={13}
              placeholder="+998911530608"
              value={phone}
              onChange={handlePhoneChange}
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm font-mono tracking-wide text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition ${
                phoneError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
            {phoneError ? (
              <p className="text-xs text-rose-500 mt-1 font-semibold">{phoneError}</p>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">Masalan: +998911530608</p>
            )}
          </div>

          {/* To'lov summasi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              To'lov Summasi (so'm) *
            </label>
            <input
              type="number"
              required
              step="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            />
          </div>

          {/* Filial */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Filial *
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id} className="dark:bg-slate-800 dark:text-white">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Modul */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Modul *
            </label>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition cursor-pointer"
            >
              {MODULES.map((mod) => (
                <option key={mod} value={mod} className="dark:bg-slate-800 dark:text-white">
                  {mod}
                </option>
              ))}
            </select>
          </div>

          {/* Tugmalar va O'chirish */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              {/* O'chirish tugmasi */}
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>O'chirish</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-bold">Rostdanmi?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Ha, o'chiring
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 text-slate-500 dark:text-slate-400 text-xs hover:underline cursor-pointer"
                  >
                    Yo'q
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold shadow-sm shadow-indigo-500/25 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
