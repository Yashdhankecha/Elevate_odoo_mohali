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
    console.error('Login error:', error);
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
    console.error('Get current user error:', error);
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
    
    throw error;
  }
};

// Notification API functions
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/notifications', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
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
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error('Error getting unread count:', error);
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
    throw error;
  }
};

export default api;
