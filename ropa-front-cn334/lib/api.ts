import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (
      typeof window !== 'undefined' &&
      err.response?.status === 401 &&
      !window.location.pathname.startsWith('/login')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// ---------- Auth ----------
export const login = (username: string, password: string) =>
  api.post('/login', { username, password });
export const logout = () => api.post('/logout');
export const me = () => api.get('/me');
export const changePassword = (currentPassword: string, newPassword: string) =>
  api.put('/change-password', { currentPassword, newPassword });

// ---------- ROPA ----------
export const listRopa = (params?: Record<string, unknown>) =>
  api.get('/ropa', { params });
export const getRopa = (id: string | number) => api.get(`/ropa/${id}`);
export const getRopaHistory = (id: string | number) => api.get(`/ropa/${id}/history`);
export const createRopa = (data: unknown) => api.post('/ropa', data);
export const updateRopa = (id: string | number, data: unknown) => api.put(`/ropa/${id}`, data);
export const deleteRopa = (id: string | number) => api.delete(`/ropa/${id}`);
export const submitRopa = (id: string | number) => api.put(`/ropa/${id}/submit`);
export const approveRopa = (id: string | number, comment?: string) =>
  api.put(`/ropa/${id}/approve`, { comment });
export const rejectRopa = (id: string | number, reason: string) =>
  api.put(`/ropa/${id}/reject`, { reason });
export const activateRopa = (id: string | number) => api.put(`/ropa/${id}/activate`);

// ---------- Users ----------
export const listUsers = (params?: Record<string, unknown>) =>
  api.get('/user', { params });
export const getUser = (id: string | number) => api.get(`/user/${id}`);
export const createUser = (data: unknown) => api.post('/user', data);
export const updateUser = (id: string | number, data: unknown) => api.put(`/user/${id}`, data);
export const deleteUser = (id: string | number) => api.delete(`/user/${id}`);

// ---------- Audit Logs ----------
export const listAuditLogs = (params?: Record<string, unknown>) =>
  api.get('/audit-log', { params });

// ---------- Analytics ----------
export const getAnalytics = (params?: Record<string, unknown>) =>
  api.get('/analytics', { params });

// ---------- Dashboard ----------
export const getDashboard = () => api.get('/dashboard');

// ---------- Roles / Departments ----------
export const listRoles = () => api.get('/role');
export const listDepartments = () => api.get('/department');

// ---------- Import / Export ----------
export const importRopa = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/import', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  } as AxiosRequestConfig);
};
export const listImports = () => api.get('/import');
export const exportRopa = (params?: Record<string, unknown>) =>
  api.get('/export', { params, responseType: 'blob' });

export default api;
