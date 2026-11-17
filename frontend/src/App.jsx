import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar, { getCurrentMonth } from './components/Navbar';
import StatsCards from './components/StatsCards';
import DepartmentTabs from './components/DepartmentTabs';
import StudentTable from './components/StudentTable';
import AddStudentModal from './components/AddStudentModal';
import EditStudentModal from './components/EditStudentModal';
import PaymentHistoryModal from './components/PaymentHistoryModal';
import PhoneActionModal from './components/PhoneActionModal';
import EditAmountModal from './components/EditAmountModal';
import AuthorContactModal from './components/AuthorContactModal';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import { api } from './api';

export default function App() {
  // Global & Filter State
  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonth());
  const [selectedBranchId, setSelectedBranchId] = useState(null); // Filial (1: Yangiqo'rg'on, 2: Uchko'prik)
  const [selectedModule, setSelectedModule] = useState(null);     // Modul (Dasturlash asoslari, Telegram bot, Web site)
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Qora / Oq fon rejimi (Dark / Light Mode)
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('al_farganiy_theme');
      if (saved) return saved === 'dark';
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('al_farganiy_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('al_farganiy_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Data State
  const [departments, setDepartments] = useState([]); // Filiallar
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [togglingIds, setTogglingIds] = useState(new Set());

  // Auth State (localStorage da saqlanadi)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('al_farganiy_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [historyStudent, setHistoryStudent] = useState(null);
  const [phoneActionStudent, setPhoneActionStudent] = useState(null);
  const [editAmountData, setEditAmountData] = useState(null); // { student, payment }
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('al_farganiy_user', JSON.stringify(userData));
    showToast(`Xush kelibsiz, ${userData.name || userData.username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('al_farganiy_user');
    showToast("Tizimdan muvaffaqiyatli chiqildi");
  };

  const handlePromptLogin = () => {
    setIsLoginModalOpen(true);
    showToast("Ushbu amalni bajarish uchun avval tizimga kiring!", "info");
  };

  // Escape tugmasi bosilganda barcha ochiq modal oynalarni yopish
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLoginModalOpen(false);
        setIsAddModalOpen(false);
        setEditingStudent(null);
        setHistoryStudent(null);
        setPhoneActionStudent(null);
        setEditAmountData(null);
        setIsAuthorModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Filiallarni yuklash
  const loadDepartments = useCallback(async () => {
    try {
      const depts = await api.getDepartments();
      setDepartments(depts || []);
    } catch (err) {
      console.error("Filiallarni yuklab bo'lmadi:", err);
    }
  }, []);

  // 2. O'quvchilar va statistika ma'lumotlarini yuklash
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        month: selectedMonth,
      };
      if (selectedBranchId) params.department_id = selectedBranchId;
      if (selectedModule) params.module = selectedModule;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [studentsData, summaryData] = await Promise.all([
        selectedBranchId
          ? api.getDepartmentStudents(selectedBranchId, params)
          : api.getStudents(params),
        api.getPaymentSummary({
          month: selectedMonth,
          ...(selectedBranchId ? { department_id: selectedBranchId } : {}),
        }),
      ]);

      setStudents(studentsData || []);
      setSummary(summaryData || null);
    } catch (err) {
      console.error("Ma'lumotlarni yuklab bo'lmadi:", err);
      showToast("Server bilan aloqa uzildi. Qayta urinib ko'ring.", 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedBranchId, selectedModule, searchQuery]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Holat bo'yicha filtrlash (client-side)
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const p = s.latest_payment;
      if (statusFilter === 'paid') return p?.is_paid === true;
      if (statusFilter === 'unpaid') return !p?.is_paid;
      if (statusFilter === 'admin') return p?.is_paid === true && p?.is_taken_by_admin === true;
      if (statusFilter === 'teacher') return p?.is_paid === true && p?.is_taken_by_teacher === true;
      return true;
    });
  }, [students, statusFilter]);

  const totalStudentsCount = useMemo(() => {
    return departments.reduce((acc, d) => acc + (d.students_count || 0), 0);
  }, [departments]);

  // ========================================================
  // 1-KLIK TEZKOR TO'LOV TUGMASI (QUICK TOGGLE)
  // ========================================================
  const handleQuickTogglePayment = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const currentPaid = Boolean(student.latest_payment?.is_paid);
    const newPaidStatus = !currentPaid;

    // Optimistik yangilash:
    // To'lov qilmagan bo'lsa hech kimda emas!
    // To'lov qilsa majburiy admin (default)
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentPay = s.latest_payment || {
          id: 0,
          student_id: studentId,
          month: selectedMonth,
          amount: 250000.0,
          created_at: new Date().toISOString(),
        };
        return {
          ...s,
          latest_payment: {
            ...currentPay,
            is_paid: newPaidStatus,
            is_taken_by_teacher: newPaidStatus ? false : false,
            is_taken_by_admin: newPaidStatus ? true : false,
          },
        };
      })
    );

    setTogglingIds((prev) => new Set(prev).add(studentId));

    try {
      const updatedPayment = await api.quickTogglePayment(studentId, {
        month: selectedMonth,
        recipient: 'admin',
      });

      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, latest_payment: updatedPayment } : s
        )
      );

      const newSummary = await api.getPaymentSummary({
        month: selectedMonth,
        ...(selectedBranchId ? { department_id: selectedBranchId } : {}),
      });
      setSummary(newSummary);

      showToast(
        newPaidStatus
          ? `${student.full_name}: To'lov qabul qilindi!`
          : `${student.full_name}: To'lov bekor qilindi!`
      );
    } catch (err) {
      console.error("To'lovni o'zgartirishda xatolik:", err);
      showToast("To'lovni saqlab bo'lmadi. Qayta urinib ko'ring.", 'error');
      loadData();
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  };

  // ========================================================
  // KIM OLDI (ADMIN / DOMLA) ALMASHTIRISH (MUTUALLY EXCLUSIVE)
  // ========================================================
  const handleSwitchRecipient = async (student, payment, newRecipient) => {
    // Agar to'lov qilinmagan bo'lsa, kimdaligini belgilab bo'lmaydi!
    if (!payment?.is_paid) return;

    const paymentId = payment?.id;
    const isTeacher = newRecipient === 'domla';
    const isAdmin = newRecipient === 'admin';

    // Optimistik yangilash
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== student.id) return s;
        return {
          ...s,
          latest_payment: {
            ...(s.latest_payment || {}),
            is_taken_by_teacher: isTeacher,
            is_taken_by_admin: isAdmin,
          },
        };
      })
    );

    try {
      if (paymentId) {
        const res = await api.togglePaymentStatus(paymentId, {
          recipient: newRecipient,
        });
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? { ...s, latest_payment: res } : s))
        );
      }

      const newSummary = await api.getPaymentSummary({
        month: selectedMonth,
        ...(selectedBranchId ? { department_id: selectedBranchId } : {}),
      });
      setSummary(newSummary);

      showToast(`Kim oldi: ${newRecipient === 'domla' ? 'Domla' : 'Admin'} tanlandi`);
    } catch (err) {
      console.error('Holatni yangilab bo‘lmadi:', err);
      showToast('Xatolik yuz berdi', 'error');
      loadData();
    }
  };

  // ========================================================
  // TO'LOV SUMMASINI TAHRIRLASH
  // ========================================================
  const handleSaveAmount = async (studentId, paymentId, newAmount) => {
    // Optimistik yangilash
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          latest_payment: {
            ...(s.latest_payment || {}),
            amount: newAmount,
          },
        };
      })
    );

    try {
      if (paymentId) {
        await api.updatePayment(paymentId, { amount: newAmount });
      } else {
        await api.quickTogglePayment(studentId, {
          month: selectedMonth,
          amount: newAmount,
        });
      }

      const newSummary = await api.getPaymentSummary({
        month: selectedMonth,
        ...(selectedBranchId ? { department_id: selectedBranchId } : {}),
      });
      setSummary(newSummary);

      showToast(`To'lov summasi yangilandi: ${new Intl.NumberFormat('uz-UZ').format(newAmount)} so'm`);
    } catch (err) {
      console.error('Summani saqlab bo‘lmadi:', err);
      showToast('Summani saqlashda xatolik yuz berdi', 'error');
      loadData();
    }
  };

  // ========================================================
  // YANGI O'QUVCHI QO'SHISH
  // ========================================================
  const handleAddStudent = async (studentData) => {
    try {
      await api.createStudent(studentData, selectedMonth);
      showToast("Yangi o'quvchi muvaffaqiyatli qo'shildi!");
      await loadDepartments();
      await loadData();
    } catch (err) {
      console.error("O'quvchi qo'shishda xatolik:", err);
      showToast("O'quvchini qo'shib bo'lmadi", 'error');
      throw err;
    }
  };

  // ========================================================
  // O'QUVCHINI TAHRIRLASH
  // ========================================================
  const handleUpdateStudent = async (studentId, updatedData) => {
    try {
      await api.updateStudent(studentId, updatedData);
      showToast("O'quvchi ma'lumotlari yangilandi!");
      await loadDepartments();
      await loadData();
    } catch (err) {
      console.error("O'quvchini tahrirlashda xatolik:", err);
      showToast('Tahrirlashda xatolik yuz berdi', 'error');
      throw err;
    }
  };

  // ========================================================
  // O'QUVCHINI O'CHIRISH
  // ========================================================
  const handleDeleteStudent = async (studentId) => {
    try {
      await api.deleteStudent(studentId);
      showToast("O'quvchi tizimdan o'chirildi!");
      await loadDepartments();
      await loadData();
    } catch (err) {
      console.error("O'quvchini o'chirishda xatolik:", err);
      showToast("O'chirishda xatolik yuz berdi", 'error');
      throw err;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col w-full max-w-full overflow-x-hidden ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* 1. Header / Navbar */}
      <Navbar
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenAuthorContact={() => setIsAuthorModalOpen(true)}
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Asosiy mazmun */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Statistika kartalari - domla oldi, admin oldi, yig'ilgan tushim faqat login qilinganda ko'rinadi */}
        <StatsCards summary={summary} loading={loading} isLoggedIn={Boolean(user)} />

        {/* Filial va Modul filtrlari */}
        <DepartmentTabs
          departments={departments}
          selectedBranchId={selectedBranchId}
          setSelectedBranchId={setSelectedBranchId}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          totalStudentsCount={totalStudentsCount}
          isLoggedIn={Boolean(user)}
          onPromptLogin={handlePromptLogin}
        />

        {/* O'quvchilar jadvali va mobil kartalari */}
        <StudentTable
          students={filteredStudents}
          loading={loading}
          selectedMonth={selectedMonth}
          isLoggedIn={Boolean(user)}
          onPromptLogin={handlePromptLogin}
          onQuickTogglePayment={handleQuickTogglePayment}
          onSwitchRecipient={handleSwitchRecipient}
          onOpenEditStudent={(student) => setEditingStudent(student)}
          onOpenHistory={(student) => setHistoryStudent(student)}
          onOpenPhoneAction={(student) => setPhoneActionStudent(student)}
          onOpenEditAmount={(student, payment) => setEditAmountData({ student, payment })}
          togglingIds={togglingIds}
        />
      </main>

      {/* 3. Footer */}
      <footer className="bg-white dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 py-4 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Al-Farg'oniy Academy. Barcha huquqlar himoyalangan.
        </div>
      </footer>

      {/* 4. Modals */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        departments={departments}
        onAddStudent={handleAddStudent}
      />

      <EditStudentModal
        isOpen={Boolean(editingStudent)}
        onClose={() => setEditingStudent(null)}
        student={editingStudent}
        departments={departments}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
        onUpdatePaymentAmount={(payId, newAmt) => handleSaveAmount(editingStudent?.id, payId, newAmt)}
      />

      <PaymentHistoryModal
        isOpen={Boolean(historyStudent)}
        onClose={() => setHistoryStudent(null)}
        student={historyStudent}
      />

      <PhoneActionModal
        isOpen={Boolean(phoneActionStudent)}
        onClose={() => setPhoneActionStudent(null)}
        student={phoneActionStudent}
      />

      <EditAmountModal
        isOpen={Boolean(editAmountData)}
        onClose={() => setEditAmountData(null)}
        student={editAmountData?.student}
        payment={editAmountData?.payment}
        onSaveAmount={handleSaveAmount}
      />

      <AuthorContactModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 5. Toast bildirishnomasi */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
