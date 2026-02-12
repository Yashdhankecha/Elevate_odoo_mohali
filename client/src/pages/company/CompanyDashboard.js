import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import JobManagement from './components/JobManagement';
import ApplicationsTracking from './components/ApplicationsTracking';
import InterviewScheduling from './components/InterviewScheduling';
import ReportsAnalytics from './components/ReportsAnalytics';
import ApprovalPending from '../tpo/components/ApprovalPending';

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserStatus(user.status || 'pending');
        setLoading(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserStatus('pending');
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'jobs':
        return <JobManagement />;
      case 'applications':
        return <ApplicationsTracking />;
      case 'interviews':
        return <InterviewScheduling />;
      case 'reports':
        return <ReportsAnalytics />;
      default:
        return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-100 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-8 text-gray-500 font-bold tracking-widest uppercase text-xs animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  if (userStatus !== 'active') {
    return <ApprovalPending />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Sidebar - Desktop */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Sidebar Mobile Overlay - can be added if needed, Sidebar.jsx handles mobile usually if implemented similarly */}

      {/* Main Content Area */}
      <div className={`transition-all duration-500 ease-in-out min-h-screen ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top Navbar */}
        <TopNavbar
          toggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
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

export default CompanyDashboard;