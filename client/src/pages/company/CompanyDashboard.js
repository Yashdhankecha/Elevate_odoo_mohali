import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import JobManagement from './components/JobManagement';
import ApplicationsTracking from './components/ApplicationsTracking';
import InterviewScheduling from './components/InterviewScheduling';
import ReportsAnalytics from './components/ReportsAnalytics';
import ApprovalPending from '../tpo/components/ApprovalPending';

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserStatus(user.status || 'pending'); // Default to 'pending' if not found
        setLoading(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserStatus('pending');
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking account status...</p>
        </div>
      </div>
    );
  }

  if (userStatus !== 'active') {
    return <ApprovalPending />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isCollapsed={false}
      />
      
      {/* Main Content Area */}
      <div className="ml-64">
        {/* Main Content */}
        <main className="px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;