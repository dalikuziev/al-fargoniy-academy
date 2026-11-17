import React, { useState, useEffect } from 'react';
import { X, History, CheckCircle2, XCircle, Calendar, UserCheck, ShieldCheck } from 'lucide-react';
import { api } from '../api';

export default function PaymentHistoryModal({ isOpen, onClose, student }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      loadHistory();
    }
  }, [student, isOpen]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getStudentPayments(student.id);
      setPayments(data || []);
    } catch (err) {
      console.error("To'lovlar tarixini yuklab bo'lmadi:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0) + " so'm";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
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
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">To'lovlar Tarixi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{student.full_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500">Tarix yuklanmoqda...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              To'lovlar tarixi mavjud emas.
            </div>
          ) : (
            payments.map((p) => {
              const isPaid = Boolean(p.is_paid);
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isPaid
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40'
                      : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isPaid
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPaid ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {p.month}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isPaid
                              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {isPaid ? "To'langan" : "Qarzdor"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(p.paid_at || p.created_at)}
                        </span>
                        {isPaid && (
                          <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                            {p.is_taken_by_teacher ? (
                              <>
                                <UserCheck className="w-3 h-3 text-blue-500" />
                                Domla
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3 h-3 text-purple-500" />
                                Admin
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-slate-900 dark:text-white text-sm">
                      {formatMoney(p.amount)}
                    </div>
                    {p.comment && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic truncate max-w-[150px]">
                        {p.comment}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
