import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import ResumeBuilder from './components/ResumeBuilder';
import PracticeHub from './components/PracticeHub';
import Applications from './components/Applications';
import JobBrowse from './components/JobBrowse';
import PlacementHistory from './components/PlacementHistory';
import AICareerCoach from './components/AICareerCoach';
import ProfileApproval from './components/ProfileApproval';
import InternshipOffers from './components/InternshipOffers';
import { Loader2 } from 'lucide-react';

const StudentDashboard = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

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
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-slate-100 rounded-[2rem] animate-pulse"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-blue-600 rounded-[2rem] animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        </div>
        <p className="mt-10 text-slate-400 font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">
          Synchronizing Career Node...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="glass-card p-12 rounded-[3.5rem] max-w-lg w-full text-center shadow-2xl border-white/50">
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-rose-100 shadow-inner">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Protocol Isolation</h2>
          <p className="text-slate-500 mb-10 text-sm font-medium leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-blue-600 transition-all duration-300 transform active:scale-95"
          >
            Re-initialize System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px]" />
      </div>

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      <div className={`
        transition-all duration-500 ease-in-out min-h-screen flex-1 relative z-10
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
      `}>
        <TopNavbar
          toggleSidebar={toggleSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

        <main className="p-6 md:p-10 pt-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
