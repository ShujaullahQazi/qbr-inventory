import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Prevent redirect loop / page refresh when the 401 comes from the login endpoint itself
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Listings
export const listingsAPI = {
  create: (data: any) => api.post('/listings/', data),
  getAll: (params?: any) => api.get('/listings/', { params }),
  getMy: () => api.get('/listings/my'),
  update: (id: string, data: any) => api.put(`/listings/${id}`, data),
  delete: (id: string) => api.delete(`/listings/${id}`),
};

// Matches
export const matchesAPI = {
  getAll: () => api.get('/matches/'),
  updateStatus: (id: string, status: string) => api.put(`/matches/${id}/status?status=${status}`),
};

// Notifications
export const notificationsAPI = {
  getAll: (unreadOnly = false) => api.get('/matches/notifications', { params: { unread_only: unreadOnly } }),
  markRead: (id: string) => api.put(`/matches/notifications/${id}/read`),
  markAllRead: () => api.put('/matches/notifications/read-all'),
};

// Admin
export const adminAPI = {
  getPending: () => api.get('/admin/users/pending'),
  approve: (userId: string) => api.put(`/admin/users/${userId}/approve`),
  reject: (userId: string) => api.delete(`/admin/users/${userId}/reject`),
  updateMetadata: (data: Record<string, string[]>) => api.put('/metadata', data),
};

export default api;
