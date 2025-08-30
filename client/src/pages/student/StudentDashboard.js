
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import ResumeBuilder from './components/ResumeBuilder';
import PracticeHub from './components/PracticeHub';
import SkillTracker from './components/SkillTracker';
import Applications from './components/Applications';
import JobBrowse from './components/JobBrowse';
import PlacementHistory from './components/PlacementHistory';
import AICareerCoach from './components/AICareerCoach';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'resume':
        return <ResumeBuilder />;
      case 'practice':
        return <PracticeHub />;
      case 'skills':
        return <SkillTracker />;
      case 'applications':
        return <Applications />;
      case 'jobs':
        return <JobBrowse setActiveSection={setActiveSection} />;
      case 'history':
        return <PlacementHistory />;
      case 'ai-coach':
        return <AICareerCoach />;
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

export default StudentDashboard;


