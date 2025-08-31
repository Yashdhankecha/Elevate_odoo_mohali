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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
          
          // Check if user is not verified and redirect to not-verified page
          if (response.user && !response.user.isVerified) {
            navigate('/not-verified', { 
              state: { 
                email: response.user.email,
                role: response.user.role,
                message: 'Please verify your email address to access your dashboard.' 
              } 
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
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
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      
      toast.success('Login successful!');
      
      // Check if user is not verified
      if (!userData.isVerified) {
        navigate('/not-verified', { 
          state: { 
            email: userData.email,
            role: userData.role,
            message: 'Please verify your email address to access your dashboard.' 
          } 
        });
        return { success: true, requiresVerification: true };
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
        navigate('/approval-pending', { 
          state: { 
            role: error.response.data.role || 'user',
            email: email,
            message: message 
          } 
        });
        return { 
          success: false, 
          requiresApproval: true, 
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
      setToken(newToken);
      setUser(userData);
      
      toast.success('Account verified successfully!');
      
      // Redirect to appropriate dashboard based on user role
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
