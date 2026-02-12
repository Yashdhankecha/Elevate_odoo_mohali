
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ResumeBuilder from './components/ResumeBuilder';
import PracticeHub from './components/PracticeHub';
import Applications from './components/Applications';
import JobBrowse from './components/JobBrowse';
import PlacementHistory from './components/PlacementHistory';
import AICareerCoach from './components/AICareerCoach';
import ProfileApproval from './components/ProfileApproval';
import InternshipOffers from './components/InternshipOffers';

const StudentDashboard = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize dashboard
    setLoading(false);
    
    // Check for section parameter in URL
    const urlParams = new URLSearchParams(location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [location.search]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'resume':
        return <ResumeBuilder />;
      case 'practice':
        return <PracticeHub />;
      case 'applications':
        return <Applications />;
      case 'jobs':
        return <JobBrowse setActiveSection={setActiveSection} />;
      case 'internships':
        return <InternshipOffers />;
      case 'history':
        return <PlacementHistory />;
      case 'ai-coach':
        return <AICareerCoach />;
      case 'profile-approval':
        return <ProfileApproval />;
      default:
        return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Main Content */}
        <main className="pt-6 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;


