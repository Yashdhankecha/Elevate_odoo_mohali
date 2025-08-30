import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';

import StudentDashboard from './pages/student/StudentDashboard';
import TPODashboard from './pages/tpo/TPODashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import SuperadminDashboard from './pages/superadmin/SuperadminDashboard';

function AppRoutes() {
  const { user } = useAuth();
  
  // Helper function to get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student-dashboard';
      case 'tpo':
        return '/tpo-dashboard';
      case 'company':
        return '/company-dashboard';
      case 'superadmin':
        return '/superadmin-dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      
      {/* Default route: redirect to appropriate dashboard if logged in, else login */}
      <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
      
      {/* Role-based dashboards */}
      <Route 
        path="/student-dashboard" 
        element={
          <PrivateRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex-1">
                <StudentDashboard />
              </div>
            </div>
          </PrivateRoute>
        } 
      />
      <Route path="/tpo-dashboard" element={<PrivateRoute><TPODashboard /></PrivateRoute>} />
      <Route 
        path="/company-dashboard" 
        element={
          <PrivateRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex-1">
                <CompanyDashboard />
              </div>
            </div>
          </PrivateRoute>
        } 
      />
      <Route path="/superadmin-dashboard" element={<PrivateRoute><SuperadminDashboard /></PrivateRoute>} />
      
      {/* Generic protected routes with layout */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 px-4 py-8 ml-0 md:ml-64 mt-20">
                  <Home />
                </main>
              </div>
            </div>
          </PrivateRoute>
        }
      />







      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 px-4 py-8 ml-0 md:ml-64 mt-20">
                  <Profile />
                </main>
              </div>
            </div>
          </PrivateRoute>
        }
      />
      
      {/* Catch all route - redirect to appropriate dashboard */}
      <Route path="*" element={<Navigate to={getDashboardRoute()} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
