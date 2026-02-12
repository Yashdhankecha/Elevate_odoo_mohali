import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import StudentManagement from './components/StudentManagement';
import InterviewManagement from './components/InterviewManagement';
import JobManagement from './components/JobManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import ApprovalPending from './components/ApprovalPending';
import CompanyManagement from './components/CompanyManagement';
import { useAuth } from '../../contexts/AuthContext';

const TPODashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userStatus, setUserStatus] = useState(user?.status || 'pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserStatus(user.status || 'pending');
    }
  }, [user]);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'students':
        return <StudentManagement />;
      case 'companies':
        return <CompanyManagement />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-8 text-gray-500 font-bold tracking-widest uppercase text-xs animate-pulse">
          Loading Admin Portal...
        </p>
      </div>
    );
  }

  if (userStatus !== 'active') {
    return <ApprovalPending />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20">
      {/* Sidebar - Desktop & Tablet */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-500 ease-in-out min-h-screen ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top Navbar */}
        <TopNavbar
          toggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8 pt-6">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TPODashboard;
