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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
    // If API is not available, provide mock data for testing
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.warn('API not available, using mock data for testing');
      
      // Mock user data based on email
      const mockUsers = {
        'student@test.com': {
          id: 1,
          name: 'Test Student',
          email: 'student@test.com',
          role: 'student',
          avatar: null
        },
        'company@test.com': {
          id: 2,
          name: 'Test Company',
          email: 'company@test.com',
          role: 'company',
          avatar: null
        },
        'tpo@test.com': {
          id: 3,
          name: 'Test TPO',
          email: 'tpo@test.com',
          role: 'tpo',
          avatar: null
        },
        'admin@test.com': {
          id: 4,
          name: 'Test Admin',
          email: 'admin@test.com',
          role: 'superadmin',
          avatar: null
        }
      };
      
      const mockUser = mockUsers[credentials.email.toLowerCase()];
      if (mockUser && credentials.password === 'password') {
        return {
          token: 'mock-jwt-token-' + Date.now(),
          user: mockUser
        };
      } else {
        throw new Error('Invalid credentials');
      }
    }
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
    // If API is not available, try to get user from localStorage as fallback
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        return { user: userData };
      } catch (parseError) {
        console.error('Failed to parse saved user data:', parseError);
      }
    }
    throw error;
  }
};

export default api;
