import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import Management from './components/Management';
import TPOApproval from './components/TPOApproval';
import CompanyApproval from './components/CompanyApproval';
import axios from 'axios';

const SuperadminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingTPOs, setPendingTPOs] = useState(0);
  const [pendingCompanies, setPendingCompanies] = useState(0);

  // Create axios instance with base configuration
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
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
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigateToSection = (section) => {
    setActiveSection(section);
  };

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
      default:
        return <DashboardOverview onNavigateToSection={handleNavigateToSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
        pendingTPOs={pendingTPOs}
        pendingCompanies={pendingCompanies}
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

export default SuperadminDashboard;
