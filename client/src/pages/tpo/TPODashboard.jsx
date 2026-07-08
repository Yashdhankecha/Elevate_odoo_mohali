import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import StudentManagement from './components/StudentManagement';
import DriveRequests from './components/DriveRequests';
import ReportsAnalytics from './components/ReportsAnalytics';
import ApprovalPending from './components/ApprovalPending';
import CompanyManagement from './components/CompanyManagement';
import { Menu } from 'lucide-react';
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
      case 'drive-requests':
        return <DriveRequests />;
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
          <div className="w-20 h-20 border-4 border-slate-100 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-slate-900 rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-slate-50">
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
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
           <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              <Menu size={24} />
           </button>
           <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase">TPO Admin</h1>
           <div className="w-10" />
        </header>

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
