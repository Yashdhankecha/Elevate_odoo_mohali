import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import JobManagement from './components/JobManagement';
import InterviewScheduling from './components/InterviewScheduling';
import ReportsAnalytics from './components/ReportsAnalytics';
import ApprovalPending from '../tpo/components/ApprovalPending';
import JobDetailedView from './components/JobDetailedView';
import Notifications from './components/Notifications';


const CompanyDashboard = () => {
  const { section, id } = useParams();
  const navigate = useNavigate();
  const activeSection = section || 'dashboard';

  const setActiveSection = (newSection) => {
    navigate(`/company-dashboard/${newSection}`);
  };

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
      case 'job-details':
        return <JobDetailedView />;
      case 'interviews':
        return <InterviewScheduling />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'notifications':
        return <Notifications />;
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
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />
      
      <div className={`transition-all duration-500 ease-in-out min-h-screen flex-1 relative z-10 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
           <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              <Menu size={24} />
           </button>
           <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Company</h1>
           <div className="w-10" />
        </header>

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
