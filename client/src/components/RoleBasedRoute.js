import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../pages/student/StudentDashboard';
import CompanyDashboard from '../pages/company/CompanyDashboard';
import TPODashboard from '../pages/tpo/TPODashboard';
import SuperadminDashboard from '../pages/superadmin/SuperadminDashboard';

const RoleBasedRoute = ({ allowedRoles = null }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait for authentication to load
    if (loading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    // If specific roles are allowed, check if user has access
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      // User doesn't have access to this specific route, redirect to their dashboard
      redirectToUserDashboard(user?.role);
      return;
    }

    // If accessing /dashboard (main dashboard route), redirect based on role
    if (location.pathname === '/dashboard') {
      redirectToUserDashboard(user?.role);
      return;
    }
  }, [user, isAuthenticated, loading, navigate, location.pathname, allowedRoles]);

  const redirectToUserDashboard = (role) => {
    switch (role) {
      case 'student':
        navigate('/student-dashboard', { replace: true });
        break;
      case 'company':
        navigate('/company-dashboard', { replace: true });
        break;
      case 'tpo':
        navigate('/tpo-dashboard', { replace: true });
        break;
      case 'superadmin':
        navigate('/superadmin-dashboard', { replace: true });
        break;
      default:
        // Unknown role, redirect to profile
        navigate('/profile', { replace: true });
        break;
    }
  };

  // Show loading while determining route
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If specific roles are allowed, render the appropriate dashboard
  if (allowedRoles) {
    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'company':
        return <CompanyDashboard />;
      case 'tpo':
        return <TPODashboard />;
      case 'superadmin':
        return <SuperadminDashboard />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">You don't have permission to access this dashboard.</p>
              <button 
                onClick={() => redirectToUserDashboard(user.role)} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to My Dashboard
              </button>
            </div>
          </div>
        );
    }
  }

  // This should not be reached due to useEffect redirects, but fallback
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default RoleBasedRoute;
