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
      // Check if user is not verified before logging out
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && !user.isVerified) {
        // Don't log out, just redirect to not-verified page
        window.location.href = '/not-verified';
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Student API functions
export const studentApi = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  // Applications
  getApplications: async (params = {}) => {
    const response = await api.get('/student/applications', { params });
    return response.data;
  },

  updateApplication: async (applicationId, updateData) => {
    const response = await api.put(`/student/applications/${applicationId}`, updateData);
    return response.data;
  },

  // Placement History
  getPlacementHistory: async () => {
    const response = await api.get('/student/placement-history');
    return response.data;
  },

  // Practice Sessions
  getPracticeSessions: async (params = {}) => {
    const response = await api.get('/student/practice-sessions', { params });
    return response.data;
  },

  createPracticeSession: async (sessionData) => {
    const response = await api.post('/student/practice-session', sessionData);
    return response.data;
  },

  // Skills
  getSkills: async () => {
    const response = await api.get('/student/skills');
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/student/profile', profileData);
    return response.data;
  },

  // Job Browsing and Applications
  getAvailableJobs: async (params = {}) => {
    const response = await api.get('/student/jobs', { params });
    return response.data;
  },

  applyForJob: async (jobId, applicationData) => {
    const formData = new FormData();
    formData.append('coverLetter', applicationData.coverLetter);
    formData.append('portfolio', applicationData.portfolio);
    formData.append('availability', applicationData.availability);
    formData.append('salary', applicationData.salary);
    
    if (applicationData.resume) {
      formData.append('resume', applicationData.resume);
    }

    const response = await api.post(`/student/jobs/${jobId}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getFavoriteJobs: async () => {
    const response = await api.get('/student/favorite-jobs');
    return response.data;
  },

  addFavoriteJob: async (jobId) => {
    const response = await api.post(`/student/favorite-jobs/${jobId}`);
    return response.data;
  },

  removeFavoriteJob: async (jobId) => {
    const response = await api.delete(`/student/favorite-jobs/${jobId}`);
    return response.data;
  },

  // Notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/student/notifications', { params });
    return response.data;
  },

  markNotificationsAsRead: async (notificationIds) => {
    const response = await api.put('/student/notifications/mark-read', { notificationIds });
    return response.data;
  },

  // AI Career Coach
  getAICoachData: async () => {
    const response = await api.get('/student/ai-coach');
    return response.data;
  },

  createAISession: async (sessionData) => {
    const response = await api.post('/student/ai-coach/session', sessionData);
    return response.data;
  },

  // Profile Approval
  getProfileApprovalStatus: async () => {
    const response = await api.get('/student/profile/approval-status');
    return response.data;
  },

  approveProfile: async (studentId) => {
    const response = await api.put(`/student/profile/${studentId}/approve`);
    return response.data;
  },

  rejectProfile: async (studentId, reason) => {
    const response = await api.put(`/student/profile/${studentId}/reject`, { reason });
    return response.data;
  },

  // Internship Offers
  getInternshipOffers: async (params = {}) => {
    const response = await api.get('/student/internship-offers', { params });
    return response.data;
  },

  applyForInternship: async (internshipId) => {
    const response = await api.post(`/student/internship-offers/${internshipId}/apply`);
    return response.data;
  },

  getMyInternshipApplications: async () => {
    const response = await api.get('/student/internship-applications');
    return response.data;
  },
};

export default studentApi;
