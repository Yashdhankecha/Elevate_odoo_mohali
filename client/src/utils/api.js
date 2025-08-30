import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for JWT
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('=== API REQUEST INTERCEPTOR ===');
    console.log('Request URL:', config.url);
    console.log('Request method:', config.method);
    console.log('Token present:', token ? 'YES' : 'NO');
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'None');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.log('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }
    
    // Handle 500 Internal Server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (userId, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { userId, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateUserProfile = async (profileData) => {
  try {
    console.log('=== CLIENT PROFILE UPDATE REQUEST ===');
    console.log('Profile data to send:', JSON.stringify(profileData, null, 2));
    console.log('API URL:', '/user/profile');
    console.log('Request method: PUT');
    
    const response = await api.put('/user/profile', profileData);
    
    console.log('=== CLIENT PROFILE UPDATE RESPONSE ===');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('=== CLIENT PROFILE UPDATE ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Full error object:', error);
    

// Student Dashboard API functions
export const getStudentProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.data.success) {
      return response.data.user;
    }
    throw new Error(response.data.message || 'Failed to fetch profile');
  } catch (error) {
    console.error('Error fetching student profile:', error);

    throw error;
  }
};

export const getStudentDetails = async (studentId) => {
  try {
    const response = await api.get(`/user/students/${studentId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch student details');
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw error;
  }
};

export const markNotificationsAsRead = async (notificationIds) => {
  try {
    const response = await api.put('/notifications/mark-read', { notificationIds });
    return response.data;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};


export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);

    throw error;
  }
};


export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);

export const getPracticeHistory = async () => {
  try {
    const response = await api.get('/user/practice-history');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch practice history');
  } catch (error) {
    console.error('Error fetching practice history:', error);

    throw error;
  }
};


export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error('Error getting unread count:', error);

export const getStudentAchievements = async () => {
  try {
    const response = await api.get('/user/achievements');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch achievements');
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};


// Password and account management API functions
export const changePasswordApi = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/user/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);

export const getStudentExperience = async () => {
  try {
    const response = await api.get('/user/experience');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch experience');
  } catch (error) {
    console.error('Error fetching experience:', error);

    throw error;
  }
};


export const deleteAccountApi = async (password) => {
  try {
    const response = await api.delete('/user/delete-account', {
      data: { password }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);

export const getStudentAlerts = async () => {
  try {
    const response = await api.get('/user/alerts');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch alerts');
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const getPerformanceAnalytics = async (timeRange = '30days') => {
  try {
    const response = await api.get(`/user/performance-analytics?range=${timeRange}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch performance analytics');
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    throw error;
  }
};

export const updateStudentProfile = async (profileData) => {
  try {
    const response = await api.put('/user/student-profile', profileData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update profile');
  } catch (error) {
    console.error('Error updating student profile:', error);
    throw error;
  }
};

// Superadmin Dashboard API functions
export const getSuperadminOverview = async () => {
  try {
    const response = await api.get('/superadmin/overview');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminApprovals = async () => {
  try {
    const response = await api.get('/superadmin/admin-approvals');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanyApprovals = async () => {
  try {
    const response = await api.get('/superadmin/company-approvals');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveUser = async (userId, status, reason = '') => {
  try {
    const response = await api.post(`/superadmin/approve/${userId}`, { status, reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInstitutions = async () => {
  try {
    const response = await api.get('/superadmin/institutions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSystemAnalytics = async () => {
  try {
    const response = await api.get('/superadmin/system-analytics');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
