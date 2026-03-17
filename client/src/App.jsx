import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentProfilePage from './pages/student/StudentProfilePage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import TPOProfilePage from './pages/tpo/TPOProfilePage';
import ApprovalInProcess from './pages/ApprovalInProcess';
import NotVerified from './pages/NotVerified';
import StudentDashboard from './pages/student/StudentDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import TPODashboard from './pages/tpo/TPODashboard';
import SuperadminDashboard from './pages/superadmin/SuperadminDashboard';
import Home from './pages/Home';

// Helper – returns true if the current path is a dashboard/profile/auth page
// so the global Navbar and outer <main> wrapper are suppressed.
function isDashboardOrAuth(pathname) {
  return (
    pathname.startsWith('/student-dashboard') ||
    pathname.startsWith('/company-dashboard') ||
    pathname.startsWith('/tpo-dashboard') ||
    pathname.startsWith('/superadmin-dashboard') ||
    pathname.includes('-profile') ||
    pathname === '/dashboard' ||
    pathname === '/approval-pending' ||
    pathname === '/not-verified' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/verify-otp' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  if (isDashboardOrAuth(location.pathname)) return null;
  return <Navbar />;
}

function ConditionalMain({ children }) {
  const location = useLocation();
  if (isDashboardOrAuth(location.pathname) || location.pathname === '/') {
    return <>{children}</>;
  }
  return <main className="container mx-auto px-4 py-8">{children}</main>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <ConditionalNavbar />
            <ConditionalMain>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/approval-pending" element={<ApprovalInProcess />} />
                <Route path="/not-verified" element={<NotVerified />} />

                {/* Role-based dashboard route */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <RoleBasedRoute />
                    </PrivateRoute>
                  }
                />

                {/* Student dashboard with URL-based section routing */}
                <Route
                  path="/student-dashboard"
                  element={<RoleBasedRoute allowedRoles={['student']} />}
                />
                <Route
                  path="/student-dashboard/:section"
                  element={<RoleBasedRoute allowedRoles={['student']} />}
                />

                <Route
                  path="/company-dashboard"
                  element={<RoleBasedRoute allowedRoles={['company']} />}
                />
                <Route
                  path="/company-dashboard/:section"
                  element={<RoleBasedRoute allowedRoles={['company']} />}
                />
                <Route
                  path="/company-dashboard/:section/:id"
                  element={<RoleBasedRoute allowedRoles={['company']} />}
                />

                <Route
                  path="/tpo-dashboard"
                  element={<RoleBasedRoute allowedRoles={['tpo']} />}
                />

                <Route
                  path="/superadmin-dashboard"
                  element={<RoleBasedRoute allowedRoles={['superadmin']} />}
                />

                <Route
                  path="/student-profile"
                  element={
                    <PrivateRoute>
                      <RoleBasedRoute allowedRoles={['student']} component={StudentProfilePage} />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/company-profile"
                  element={
                    <PrivateRoute>
                      <RoleBasedRoute allowedRoles={['company']} component={CompanyProfilePage} />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/tpo-profile"
                  element={
                    <PrivateRoute>
                      <RoleBasedRoute allowedRoles={['tpo']} component={TPOProfilePage} />
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
                style: { background: '#363636', color: '#fff' },
                success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

