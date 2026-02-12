
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import StudentManagement from './components/StudentManagement';
import InterviewManagement from './components/InterviewManagement';
import JobManagement from './components/JobManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import ApprovalPending from './components/ApprovalPending';

import { useAuth } from '../../contexts/AuthContext';
import { FaBars } from 'react-icons/fa';

const TPODashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userStatus, setUserStatus] = useState(user?.status || 'pending');
  const [loading, setLoading] = useState(false); // AuthContext handles initial loading
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('TPODashboard mounted. User:', user);
    if (user) {
      setUserStatus(user.status || 'pending');
    }
  }, [user]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'students':
        return <StudentManagement />;
      case 'interviews':
        return <InterviewManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      default:
        return <DashboardOverview />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking account status...</p>
        </div>
      </div>
    );
  }

  // Show approval pending if user status is not 'active'
  if (userStatus !== 'active') {
    return <ApprovalPending />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-800 text-lg tracking-tight">TPO Portal</span>
        </div>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200 shadow-sm">
          {user?.name?.charAt(0) || 'T'}
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <Sidebar
          activeSection={activeSection}
          setActiveSection={(section) => {
            setActiveSection(section);
            setMobileSidebarOpen(false);
          }}
          isCollapsed={sidebarCollapsed}
        // Sidebar component handles its own collapse state logic for desktop, 
        // but we can pass mobileOpen if needed. 
        // However, wrapping it in a div that handles visibility is cleaner.
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 min-h-screen bg-gray-50 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
        {/* Main Content */}
        <main className="p-4 md:p-8 w-full max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TPODashboard;
