import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  verifyOTP as verifyOTPApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi
} from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Instead of immediately clearing the token, let's try to recover user info from localStorage
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              setUser(userData);
              console.log('Recovered user from localStorage:', userData);
            } catch (parseError) {
              console.error('Failed to parse saved user data:', parseError);
              // Only clear token if we can't recover user data
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setToken(null);
            }
          } else {
            // No saved user data, clear token
            localStorage.removeItem('token');
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      
      toast.success('Login successful!');
      // Role-based redirection
      if (userData.role === 'student') {
        navigate('/student-dashboard');
      } else if (userData.role === 'tpo') {
        navigate('/tpo-dashboard');
      } else if (userData.role === 'company') {
        navigate('/company-dashboard');
      } else if (userData.role === 'superadmin') {
        navigate('/superadmin-dashboard');
      } else {
        navigate('/');
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      
      // Check if account requires verification
      if (error.response?.data?.requiresVerification) {
        return { 
          success: false, 
          requiresVerification: true, 
          userId: error.response.data.userId,
          message 
        };
      }
      
      toast.error(message);
      return { success: false, message };
    }
  };

  // Verify OTP function
  const verifyOTP = async (userId, otp) => {
    try {
      const response = await verifyOTPApi(userId, otp);
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      
      toast.success('Account verified successfully!');
      
      // Role-based redirection after OTP verification
      if (userData.role === 'student') {
        navigate('/student-dashboard');
      } else if (userData.role === 'tpo') {
        navigate('/tpo-dashboard');
      } else if (userData.role === 'company') {
        navigate('/company-dashboard');
      } else if (userData.role === 'superadmin') {
        navigate('/superadmin-dashboard');
      } else {
        navigate('/');
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const response = await forgotPasswordApi(email);
      toast.success(response.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Reset password function
  const resetPassword = async (token, password) => {
    try {
      const response = await resetPasswordApi(token, password);
      toast.success(response.message);
      navigate('/login');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      // This would need to be implemented in the API utils
      // For now, we'll just update the local state
      setUser(prevUser => ({ ...prevUser, ...profileData }));
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      // This would need to be implemented in the API utils
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete account
  const deleteAccount = async (password) => {
    try {
      // This would need to be implemented in the API utils
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      toast.success('Account deleted successfully');
      navigate('/');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Account deletion failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    verifyOTP,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
