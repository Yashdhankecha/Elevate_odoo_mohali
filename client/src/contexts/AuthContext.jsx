import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  verifyOTP as verifyOTPApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  updateUserProfile as updateUserProfileApi,
  changePasswordApi,
  deleteAccountApi
} from '../utils/api';

const AuthContext = createContext();

// Safely parse a JSON string from localStorage; returns null on any failure
const safeParseJSON = (str) => {
  if (!str || str === 'undefined' || str === 'null') return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Read token from localStorage safely — treats 'undefined'/'null' strings as absent
const safeGetToken = () => {
  const t = localStorage.getItem('token');
  if (!t || t === 'undefined' || t === 'null') {
    localStorage.removeItem('token');
    return null;
  }
  return t;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(safeGetToken);
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async (retryCount = 0) => {
      try {
        if (token) {
          const response = await getCurrentUser();
          // ApiResponse shape: { statusCode, data: { user }, message, success }
          const userData = response.data?.user ?? response.user;
          setUser(userData);

          // Check if user is not verified (email) and redirect to not-verified page
          if (userData && !userData.isVerified) {
            navigate('/not-verified', {
              state: {
                email: userData.email,
                role: userData.role,
                type: 'email',
                message: 'Please verify your email address to access your dashboard.'
              }
            });
          }
          // Check if student is pending TPO approval
          else if (userData && userData.role === 'student' && userData.verificationStatus && userData.verificationStatus !== 'verified') {
            navigate('/not-verified', {
              state: {
                email: userData.email,
                role: userData.role,
                type: 'tpo_approval',
                verificationStatus: userData.verificationStatus,
                message: userData.verificationStatus === 'rejected'
                  ? 'Your profile has been rejected by the TPO. Please contact your college administration.'
                  : 'Your profile is pending approval from your TPO. Please wait for verification.'
              }
            });
          }
        } else {
          // No token — clear any stale user data and reset state
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);

        // Remove token on 401/403 — it is invalid or expired
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Token is invalid or expired, removing from storage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        } else {
          // Network / server error — use cached user as fallback
          console.log('Non-auth error, falling back to localStorage');
          const storedUser = safeParseJSON(localStorage.getItem('user'));
          if (storedUser) setUser(storedUser);

          // Retry once on server errors (5xx / no response)
          if (retryCount === 0 && (!error.response || error.response.status >= 500)) {
            console.log('Retrying auth check due to server error...');
            setTimeout(() => checkAuth(1), 1000);
            return; // keep loading true while retrying
          }
        }
      } finally {
        // Always release the loading gate unless we explicitly returned above
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, navigate]);

  // Helper function to get dashboard route based on user role
  const getDashboardRoute = (userRole) => {
    switch (userRole) {
      case 'student':
        return '/student-dashboard';
      case 'company':
        return '/company-dashboard';
      case 'tpo':
        return '/tpo-dashboard';
      case 'superadmin':
        return '/superadmin-dashboard';
      default:
        return '/profile';
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      // Server wraps payload in ApiResponse: { statusCode, data: { token, user }, message, success }
      const { token: newToken, user: userData } = response.data ?? response;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      toast.success('Login successful!');

      // Check if user is not verified (email)
      if (!userData.isVerified) {
        navigate('/not-verified', {
          state: {
            email: userData.email,
            role: userData.role,
            type: 'email',
            message: 'Please verify your email address to access your dashboard.'
          }
        });
        return { success: true, requiresVerification: true };
      }

      // Check if student is pending TPO approval
      if (userData.role === 'student' && userData.verificationStatus && userData.verificationStatus !== 'verified') {
        navigate('/not-verified', {
          state: {
            email: userData.email,
            role: userData.role,
            type: 'tpo_approval',
            verificationStatus: userData.verificationStatus,
            message: userData.verificationStatus === 'rejected'
              ? 'Your profile has been rejected by the TPO. Please contact your college administration.'
              : 'Your profile is pending approval from your TPO. Please wait for verification.'
          }
        });
        return { success: true, requiresApproval: true };
      }

      // Check if TPO or Company user is pending approval
      if ((userData.role === 'tpo' || userData.role === 'company') && userData.status === 'pending') {
        navigate('/approval-pending', {
          state: {
            role: userData.role,
            email: userData.email,
            message: 'Your account is pending approval from super admin.'
          }
        });
        return { success: true, requiresApproval: true };
      }

      // Redirect to appropriate dashboard based on user role
      const dashboardRoute = getDashboardRoute(userData.role);
      navigate(dashboardRoute);

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

      // Check if account requires approval (for TPO/Company)
      if (error.response?.data?.requiresApproval) {
        return {
          success: false,
          requiresApproval: true,
          role: error.response.data.role || 'user',
          message
        };
      }

      // Check if account was rejected
      if (error.response?.data?.registrationRejected) {
        return {
          success: false,
          registrationRejected: true,
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
      // Server wraps payload in ApiResponse: { statusCode, data: { token, user }, message, success }
      const { token: newToken, user: userData } = response.data ?? response;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      toast.success('Account verified successfully!');

      // Check if user needs approval (Company and TPO users)
      if ((userData.role === 'company' || userData.role === 'tpo') && userData.status === 'pending') {
        navigate('/approval-pending', {
          state: {
            role: userData.role,
            email: userData.email,
            message: 'Your account is pending approval from super admin.'
          }
        });
        return { success: true, requiresApproval: true };
      }

      // Check if student needs TPO approval
      if (userData.role === 'student' && userData.verificationStatus && userData.verificationStatus !== 'verified') {
        navigate('/not-verified', {
          state: {
            email: userData.email,
            role: userData.role,
            type: 'tpo_approval',
            verificationStatus: userData.verificationStatus,
            message: 'Your profile is pending approval from your TPO. Please wait for verification.'
          }
        });
        return { success: true, requiresApproval: true };
      }

      // For students and approved users, redirect to appropriate dashboard
      const dashboardRoute = getDashboardRoute(userData.role);
      navigate(dashboardRoute);

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
      navigate('/login');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await updateUserProfileApi(profileData);

      if (response.success) {
        // Update local state with the response from server
        const updatedUser = { ...user, ...response.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success(response.message || 'Profile updated successfully!');
        return { success: true };
      } else {
        toast.error(response.message || 'Profile update failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await changePasswordApi(currentPassword, newPassword);

      if (response.success) {
        toast.success(response.message || 'Password changed successfully!');
        return { success: true };
      } else {
        toast.error(response.message || 'Password change failed');
        return { success: false, message: response.message };
      }
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
      setToken(null);
      setUser(null);
      toast.success('Account deleted successfully');
      navigate('/login');
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
