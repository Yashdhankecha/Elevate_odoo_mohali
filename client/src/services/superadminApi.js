import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Superadmin API functions
export const superadminApi = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/superadmin/dashboard');
    return response.data;
  },

  // Admin Management
  getAdminRequests: async () => {
    const response = await api.get('/superadmin/admin-requests');
    return response.data;
  },

  approveAdminRequest: async (adminId) => {
    const response = await api.put(`/superadmin/admin-requests/${adminId}/approve`);
    return response.data;
  },

  rejectAdminRequest: async (adminId) => {
    const response = await api.put(`/superadmin/admin-requests/${adminId}/reject`);
    return response.data;
  },

  // User Management
  getUsers: async (params = {}) => {
    const response = await api.get('/superadmin/users', { params });
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/superadmin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/superadmin/users/${userId}`);
    return response.data;
  },

  // Institution Management
  getInstitutions: async () => {
    const response = await api.get('/superadmin/institutions');
    return response.data;
  },

  createInstitution: async (institutionData) => {
    const response = await api.post('/superadmin/institutions', institutionData);
    return response.data;
  },

  updateInstitution: async (institutionId, institutionData) => {
    const response = await api.put(`/superadmin/institutions/${institutionId}`, institutionData);
    return response.data;
  },

  deleteInstitution: async (institutionId) => {
    const response = await api.delete(`/superadmin/institutions/${institutionId}`);
    return response.data;
  },

  // System Settings
  getSystemSettings: async () => {
    const response = await api.get('/superadmin/system-settings');
    return response.data;
  },

  updateSystemSettings: async (settings) => {
    const response = await api.put('/superadmin/system-settings', settings);
    return response.data;
  },

  // Security Monitoring
  getSecurityLogs: async (params = {}) => {
    const response = await api.get('/superadmin/security-logs', { params });
    return response.data;
  },

  getSystemMetrics: async () => {
    const response = await api.get('/superadmin/system-metrics');
    return response.data;
  },
};

// Individual export functions for direct use
export const getAdminRequests = async () => {
  const response = await api.get('/superadmin/admin-requests');
  return response.data;
};

export const approveAdminRequest = async (adminId) => {
  const response = await api.put(`/superadmin/admin-requests/${adminId}/approve`);
  return response.data;
};

export const rejectAdminRequest = async (adminId) => {
  const response = await api.put(`/superadmin/admin-requests/${adminId}/reject`);
  return response.data;
};

export default superadminApi;
