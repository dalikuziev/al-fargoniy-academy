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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">To'lovlar Tarixi</h3>
              <p className="text-xs text-slate-500 font-medium">
                {student.full_name} • {student.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2" />
              Tarix yuklanmoqda...
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Hozircha hech qanday to'lov yozuvi topilmadi.
            </div>
          ) : (
            payments.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition ${
                  p.is_paid
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : 'bg-rose-50/40 border-rose-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-800 text-sm">{p.month}</span>
                    <span className="text-xs text-slate-500 font-semibold">
                      ({formatMoney(p.amount)})
                    </span>
                  </div>

                  {p.is_paid ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      To'langan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" />
                      Qarzdor
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200/40">
                  <span className="font-semibold flex items-center gap-1">
                    Kim oldi:{' '}
                    {p.is_taken_by_teacher ? (
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-200 inline-flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Domla
                      </span>
                    ) : (
                      <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold border border-purple-200 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </span>

                  {p.paid_at && (
                    <span className="text-slate-400">
                      {formatDate(p.paid_at)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
