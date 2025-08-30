import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import JobManagement from './components/JobManagement';
import ApplicationsTracking from './components/ApplicationsTracking';
import InterviewScheduling from './components/InterviewScheduling';
import Announcements from './components/Announcements';
import CompanyProfile from './components/CompanyProfile';
import ReportsAnalytics from './components/ReportsAnalytics';
import Settings from './components/Settings';

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
      case 'announcements':
        return <Announcements />;
      case 'profile':
        return <CompanyProfile />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <Settings />;
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

export default CompanyDashboard;