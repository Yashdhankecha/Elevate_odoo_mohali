import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ResumeBuilder from './components/ResumeBuilder';
import PracticeHub from './components/PracticeHub';
import PracticeSession from './components/PracticeSession';
import Applications from './components/Applications';
import JobBrowse from './components/JobBrowse';
import AICareerCoach from './components/AICareerCoach';
import ProfileApproval from './components/ProfileApproval';
import InternshipOffers from './components/InternshipOffers';
import ApplicationTracking from './components/ApplicationTracking';
import { Loader2, Menu } from 'lucide-react';

const SLUG_TO_SECTION = {
  'browse-jobs': 'jobs',
  'internships': 'internships',
  'applications': 'applications',
  'practice-hub': 'practice',
  'solve': 'solve',
  'resume-builder': 'resume',
  'ai-coach': 'ai-coach',
  'profile-approval': 'profile-approval',
  'application-tracking': 'tracking',
};

const SECTION_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_SECTION).map(([slug, section]) => [section, slug])
);

const StudentDashboard = () => {
  const { section: sectionParam } = useParams();
  const navigate = useNavigate();

  const activeSection = SLUG_TO_SECTION[sectionParam] || 'dashboard';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const setActiveSection = (sectionKey) => {
    if (sectionKey === 'dashboard') {
      navigate('/student-dashboard');
    } else {
      const slug = SECTION_TO_SLUG[sectionKey] || sectionKey;
      navigate(`/student-dashboard/${slug}`);
    }
  };

  const toggleSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview />;
      case 'resume': return <ResumeBuilder />;
      case 'practice': return <PracticeHub />;
      case 'solve': return <PracticeSession />;
      case 'applications': return <Applications />;
      case 'jobs': return <JobBrowse setActiveSection={setActiveSection} />;
      case 'internships': return <InternshipOffers />;
      case 'ai-coach': return <AICareerCoach />;
      case 'profile-approval': return <ProfileApproval />;
      case 'tracking': return <ApplicationTracking />;
      default: return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-slate-700 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden">
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
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        {/* Mobile Nav Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
           <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              <Menu size={24} />
           </button>
           <h1 className="text-lg font-black text-slate-900 tracking-tighter">ELEVATE</h1>
           <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="p-4 md:p-8 pt-4 lg:pt-8 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto animate-fade-in pb-10">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
