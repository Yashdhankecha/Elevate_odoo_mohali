import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import ApprovalInProcess from './pages/ApprovalInProcess';
import StudentDashboard from './pages/student/StudentDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import TPODashboard from './pages/tpo/TPODashboard';
import SuperadminDashboard from './pages/superadmin/SuperadminDashboard';

// Component to conditionally render Navbar and styling
function ConditionalNavbar() {
  const location = useLocation();
  const isDashboardPage = location.pathname.includes('-dashboard') || 
                          location.pathname === '/dashboard' ||
                          location.pathname === '/approval-pending';
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/signup' || 
                     location.pathname === '/verify-otp' || 
                     location.pathname === '/forgot-password' || 
                     location.pathname === '/reset-password';
  
  // Don't render Navbar on dashboard pages, approval pending page, and auth pages
  if (isDashboardPage || isAuthPage) {
    return null;
  }
  
  return <Navbar />;
}

// Component to conditionally apply main styling
function ConditionalMain({ children }) {
  const location = useLocation();
  const isDashboardPage = location.pathname.includes('-dashboard') || location.pathname === '/dashboard';
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/signup' || 
                     location.pathname === '/verify-otp' || 
                     location.pathname === '/forgot-password' || 
                     location.pathname === '/reset-password';
  
  if (isDashboardPage || isAuthPage) {
    return <>{children}</>;
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <ConditionalNavbar />
          <ConditionalMain>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/approval-pending" element={<ApprovalInProcess />} />
              
              {/* Role-based dashboard routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <RoleBasedRoute />
                  </PrivateRoute>
                } 
              />
              
              {/* Individual dashboard routes */}
              <Route 
                path="/student-dashboard" 
                element={
                  <RoleBasedRoute allowedRoles={['student']} />
                } 
              />
              
              <Route 
                path="/company-dashboard" 
                element={
                  <RoleBasedRoute allowedRoles={['company']} />
                } 
              />
              
              <Route 
                path="/tpo-dashboard" 
                element={
                  <RoleBasedRoute allowedRoles={['tpo']} />
                } 
              />
              
              <Route 
                path="/superadmin-dashboard" 
                element={
                  <RoleBasedRoute allowedRoles={['superadmin']} />
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ConditionalMain>
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
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
