import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// TPO API functions
export const tpoApi = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/tpo/dashboard-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Students Management
  getStudents: async (params = {}) => {
    try {
      const response = await api.get('/tpo/students', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Companies Management
  getCompanies: async (params = {}) => {
    try {
      const response = await api.get('/tpo/companies', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Placement Drives
  getPlacementDrives: async (params = {}) => {
    try {
      const response = await api.get('/tpo/placement-drives', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Training Programs
  getTrainingPrograms: async () => {
    try {
      const response = await api.get('/tpo/training-programs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Internship Records
  getInternshipRecords: async () => {
    try {
      const response = await api.get('/tpo/internship-records');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reports and Analytics
  getReportsAnalytics: async () => {
    try {
      const response = await api.get('/tpo/reports-analytics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/tpo/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default tpoApi;
