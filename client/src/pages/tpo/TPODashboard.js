import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import StudentManagement from './components/StudentManagement';
import CompanyManagement from './components/CompanyManagement';
import PlacementDrives from './components/PlacementDrives';
import TrainingPrograms from './components/TrainingPrograms';
import InternshipRecords from './components/InternshipRecords';
import ReportsAnalytics from './components/ReportsAnalytics';
import Settings from './components/Settings';

const TPODashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'students':
        return <StudentManagement />;
      case 'companies':
        return <CompanyManagement />;
      case 'drives':
        return <PlacementDrives />;
      case 'training':
        return <TrainingPrograms />;
      case 'internships':
        return <InternshipRecords />;
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

export default TPODashboard;
