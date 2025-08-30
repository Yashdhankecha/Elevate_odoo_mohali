import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import AdminApproval from './components/AdminApproval';
import CompanyApproval from './components/CompanyApproval';
import InstitutionManagement from './components/InstitutionManagement';
import SystemSettings from './components/SystemSettings';

const SuperadminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'admin-approval':
        return <AdminApproval />;
      case 'company-approval':
        return <CompanyApproval />;
      case 'institutions':
        return <InstitutionManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Navbar */}
        <TopNavbar toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <main className="pt-16 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
