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
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Students Management
  getStudents: async (params = {}) => {
    try {
      const response = await api.get('/tpo/students', { params });
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Companies Management
  getCompanies: async (params = {}) => {
    try {
      const response = await api.get('/tpo/companies', { params });
      return response.data.data || response.data; // Handle both response formats
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Placement Drives
  getPlacementDrives: async (params = {}) => {
    try {
      const response = await api.get('/tpo/placement-drives', { params });
      return response.data.data || response.data; // Handle both response formats
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create Placement Drive
  createPlacementDrive: async (driveData) => {
    try {
      const response = await api.post('/tpo/placement-drives', driveData);
      return response.data.data || response.data; // Handle both response formats
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },



  // Internship Records
  getInternshipRecords: async () => {
    try {
      const response = await api.get('/tpo/internship-records');
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reports and Analytics
  getReportsAnalytics: async () => {
    try {
      const response = await api.get('/tpo/reports-analytics');
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update Profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/tpo/profile', profileData);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Student Management
  updateStudentPlacement: async (studentId, placementData) => {
    try {
      const response = await api.put(`/tpo/students/${studentId}`, placementData);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStudentApplications: async (studentId) => {
    try {
      const response = await api.get(`/tpo/students/${studentId}/applications`);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addStudent: async (studentData) => {
    try {
      const response = await api.post('/tpo/students', studentData);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.put(`/tpo/students/${studentId}`, studentData);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteStudent: async (studentId) => {
    try {
      const response = await api.delete(`/tpo/students/${studentId}`);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Company Management
  updateCompanyStatus: async (companyId, status) => {
    try {
      const response = await api.put(`/tpo/companies/${companyId}/status`, { status });
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Placement Drive Management
  getDriveApplications: async (driveId) => {
    try {
      const response = await api.get(`/tpo/placement-drives/${driveId}/applications`);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Notifications
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/tpo/notifications', notificationData);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Data Export
  exportStudentData: async () => {
    try {
      const response = await api.get('/tpo/export/students');
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk Operations
  bulkUpdateStudents: async (studentIds, updateData) => {
    try {
      const response = await api.put('/tpo/students/bulk-update', {
        studentIds,
        updateData
      });
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send Notifications
  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/tpo/notifications', notificationData);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Activity Feed
  getActivityFeed: async (params = {}) => {
    try {
      const response = await api.get('/tpo/activity-feed', { params });
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get Placement Trends
  getPlacementTrends: async (params = {}) => {
    try {
      const response = await api.get('/tpo/placement-trends', { params });
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Student Approval System
  approveStudent: async (studentId) => {
    try {
      const response = await api.put(`/tpo/students/${studentId}/approve`);
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  rejectStudent: async (studentId, reason) => {
    try {
      const response = await api.put(`/tpo/students/${studentId}/reject`, { reason });
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  bulkApproveStudents: async (studentIds) => {
    try {
      const response = await api.put('/tpo/students/bulk-approve', { studentIds });
      return response.data.data; // Access the nested data property
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Internship Management
  getInternshipOffers: async (params = {}) => {
    try {
      const response = await api.get('/tpo/internship-offers', { params });
      return response.data.data || response.data; // Handle both response formats
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createInternshipOffer: async (internshipData) => {
    try {
      const response = await api.post('/tpo/internship-offers', internshipData);
      return response.data; // Return full response for success check
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateInternshipOffer: async (internshipId, internshipData) => {
    try {
      const response = await api.put(`/tpo/internship-offers/${internshipId}`, internshipData);
      return response.data; // Return full response for success check
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteInternshipOffer: async (internshipId) => {
    try {
      const response = await api.delete(`/tpo/internship-offers/${internshipId}`);
      return response.data; // Return full response for success check
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getInternshipApplications: async (internshipId) => {
    try {
      const response = await api.get(`/tpo/internship-offers/${internshipId}/applications`);
      return response.data.data || response.data; // Handle both response formats
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default tpoApi;
