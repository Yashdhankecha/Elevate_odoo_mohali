import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import Management from './components/Management';
import TPOApproval from './components/TPOApproval';
import CompanyApproval from './components/CompanyApproval';
import SecurityMonitoring from './components/SecurityMonitoring';
import SystemSettings from './components/SystemSettings';
import axios from 'axios';

const SuperadminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingTPOs, setPendingTPOs] = useState(0);
  const [pendingCompanies, setPendingCompanies] = useState(0);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
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
      const pendingUsers = response.data.pendingUsers || [];
      const tpoCount = pendingUsers.filter(user => user.role === 'tpo').length;
      const companyCount = pendingUsers.filter(user => user.role === 'company').length;

      setPendingTPOs(tpoCount);
      setPendingCompanies(companyCount);
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
        <TopNavbar
          toggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

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
