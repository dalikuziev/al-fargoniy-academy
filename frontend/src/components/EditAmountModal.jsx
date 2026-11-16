import React, { useState, useEffect } from 'react';
import { X, Banknote, Check } from 'lucide-react';

export default function EditAmountModal({
  isOpen,
  onClose,
  student,
  payment,
  onSaveAmount,
}) {
  const [amount, setAmount] = useState('250000');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (payment) {
      setAmount(String(payment.amount || 250000));
    }
  }, [payment]);

  if (!isOpen || !student) return null;

  const quickAmounts = [150000, 200000, 250000, 300000, 400000];

  const handleSave = async (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    try {
      setSaving(true);
      await onSaveAmount(student.id, payment?.id, val);
      onClose();
    } finally {
      setSaving(false);
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
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">To'lov Summasi</h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                {student.full_name}
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
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Oylik Summa (so'm)
            </label>
            <input
              type="number"
              step="5000"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
            />
          </div>

          {/* Tezkor summalar */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-1.5">Tezkor summalar:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="px-2 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg transition font-medium border border-transparent hover:border-emerald-200"
                >
                  {new Intl.NumberFormat('uz-UZ').format(q)}
                </button>
              ))}
            </div>
          </div>

          {/* Tugmalar */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
