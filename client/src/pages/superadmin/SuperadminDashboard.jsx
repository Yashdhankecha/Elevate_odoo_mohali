import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import Management from './components/Management';
import TPOApproval from './components/TPOApproval';
import CompanyApproval from './components/CompanyApproval';
import SecurityMonitoring from './components/SecurityMonitoring';
import SystemSettings from './components/SystemSettings';
import { Menu } from 'lucide-react';
import axios from 'axios';

const SuperadminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingTPOs, setPendingTPOs] = useState(0);
  const [pendingCompanies, setPendingCompanies] = useState(0);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    fetchPendingCounts();
  }, []);

  const fetchPendingCounts = async () => {
    try {
      const response = await api.get('/admin/pending-registrations');
      // ApiResponse envelope: response.data = { statusCode, data: { pendingUsers: [] }, message }
      const payload = response.data?.data ?? response.data;
      const pendingUsers = Array.isArray(payload?.pendingUsers)
        ? payload.pendingUsers
        : Array.isArray(payload)
          ? payload
          : [];
      setPendingTPOs(pendingUsers.filter(user => user.role === 'tpo').length);
      setPendingCompanies(pendingUsers.filter(user => user.role === 'company').length);
    } catch (error) {
      console.error('Error fetching pending counts:', error);
    }
  };

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleNavigateToSection = (section) => setActiveSection(section);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onNavigateToSection={handleNavigateToSection} />;
      case 'management':
        return <Management />;
      case 'tpo-approval':
        return <TPOApproval onApprovalProcessed={fetchPendingCounts} />;
      case 'company-approval':
        return <CompanyApproval onApprovalProcessed={fetchPendingCounts} />;
      case 'monitoring':
        return <SecurityMonitoring />;
      case 'security':
        return <SecurityMonitoring />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardOverview onNavigateToSection={handleNavigateToSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-100/50 rounded-full blur-[120px]" />
      </div>

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        pendingTPOs={pendingTPOs}
        pendingCompanies={pendingCompanies}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      <div className={`flex-1 transition-all duration-500 ease-in-out min-h-screen relative z-10 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
           <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              <Menu size={24} />
           </button>
           <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Super Admin</h1>
           <div className="w-10" />
        </header>

        <main className="p-6 lg:p-10 pt-8">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
