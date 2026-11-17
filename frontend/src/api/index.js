import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // --- Filiallar (Branches / Departments) ---
  getDepartments: async () => {
    const res = await apiClient.get('/departments');
    return res.data;
  },

  getDepartmentDetail: async (deptId) => {
    const res = await apiClient.get(`/departments/${deptId}`);
    return res.data;
  },

  getDepartmentStudents: async (deptId, params = {}) => {
    const res = await apiClient.get(`/departments/${deptId}/students`, { params });
    return res.data;
  },

  // --- O'quvchilar (Students) ---
  getStudents: async (params = {}) => {
    const res = await apiClient.get('/students', { params });
    return res.data;
  },

  getStudent: async (studentId, month = '2026-11') => {
    const res = await apiClient.get(`/students/${studentId}`, { params: { month } });
    return res.data;
  },

  createStudent: async (studentData, month = '2026-11') => {
    const res = await apiClient.post('/students', studentData, { params: { month } });
    return res.data;
  },

  updateStudent: async (studentId, studentData) => {
    const res = await apiClient.put(`/students/${studentId}`, studentData);
    return res.data;
  },

  deleteStudent: async (studentId) => {
    const res = await apiClient.delete(`/students/${studentId}`);
    return res.data;
  },

  // --- To'lovlar (Payments) ---
  quickTogglePayment: async (studentId, { month = '2026-11', recipient = 'admin' } = {}) => {
    const res = await apiClient.post(`/payments/quick-toggle/${studentId}`, null, {
      params: { month, recipient },
    });
    return res.data;
  },

  togglePaymentStatus: async (paymentId, toggleData) => {
    const res = await apiClient.patch(`/payments/${paymentId}/toggle`, toggleData);
    return res.data;
  },

  updatePayment: async (paymentId, paymentData) => {
    const res = await apiClient.patch(`/payments/${paymentId}`, paymentData);
    return res.data;
  },

  recordPayment: async (paymentData) => {
    const res = await apiClient.post('/payments/record', paymentData);
    return res.data;
  },

  getStudentPayments: async (studentId) => {
    const res = await apiClient.get(`/payments/student/${studentId}`);
    return res.data;
  },

  getPaymentSummary: async (params = {}) => {
    const res = await apiClient.get('/payments/summary', { params });
    return res.data;
  },

  // --- Autentifikatsiya (Auth) ---
  login: async (username, password) => {
    const res = await apiClient.post('/auth/login', { username, password });
    return res.data;
  },

  // Server holatini tekshirish
  checkHealth: async () => {
    try {
      const res = await apiClient.get('/health', { timeout: 3000 });
      return res.data?.status === 'online';
    } catch {
      return false;
    }
  },
};

export default api;
