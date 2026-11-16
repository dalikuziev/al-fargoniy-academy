import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Check } from 'lucide-react';

export default function CommentModal({
  isOpen,
  onClose,
  student,
  payment,
  onSaveComment,
}) {
  const [commentText, setCommentText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (payment) {
      setCommentText(payment.comment || '');
    } else {
      setCommentText('');
    }
  }, [payment]);

  if (!isOpen || !student) return null;

  const quickTemplates = [
    "Kartaga to'ladi",
    "Yarmini berdi",
    "Keyingi dars beradi",
    "Oyoq singan / kasal",
    "Naqd berdi",
    "Admin oldi",
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSaveComment(student.id, payment?.id, commentText.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">To'lov Haqida Izoh</h3>
              <p className="text-xs text-slate-500">{student.full_name}</p>
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
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Izoh matni
            </label>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Masalan: 'Kartaga to'ladi', 'Yarmini berdi', 'Oyoq singan'..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition resize-none"
            />
          </div>

          {/* Quick templates */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Tezkor namunalar:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickTemplates.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => setCommentText(template)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded-lg transition border border-transparent hover:border-amber-200"
                >
                  + {template}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-sm shadow-amber-500/25 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saqlanmoqda...' : 'Izohni Saqlash'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
