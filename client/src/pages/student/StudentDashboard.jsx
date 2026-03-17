import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import ResumeBuilder from './components/ResumeBuilder';
import PracticeHub from './components/PracticeHub';
import Applications from './components/Applications';
import JobBrowse from './components/JobBrowse';
import AICareerCoach from './components/AICareerCoach';
import ProfileApproval from './components/ProfileApproval';
import InternshipOffers from './components/InternshipOffers';
import { Loader2 } from 'lucide-react';

// Map URL slug → internal section key
const SLUG_TO_SECTION = {
  'browse-jobs': 'jobs',
  'internships': 'internships',
  'applications': 'applications',
  'practice-hub': 'practice',
  'resume-builder': 'resume',
  'ai-coach': 'ai-coach',
  'profile-approval': 'profile-approval',
};

// Map internal section key → URL slug (reverse of above)
const SECTION_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_SECTION).map(([slug, section]) => [section, slug])
);

const StudentDashboard = () => {
  const { section: sectionParam } = useParams();   // URL slug from /student-dashboard/:section
  const navigate = useNavigate();

  // Derive the active section from the URL param; default to 'dashboard'
  const activeSection = SLUG_TO_SECTION[sectionParam] || (sectionParam ? 'dashboard' : 'dashboard');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Navigate to a section by pushing the correct URL
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
      case 'applications': return <Applications />;
      case 'jobs': return <JobBrowse setActiveSection={setActiveSection} />;
      case 'internships': return <InternshipOffers />;
      case 'ai-coach': return <AICareerCoach />;
      case 'profile-approval': return <ProfileApproval />;
      default: return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-slate-700 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Loading Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded border border-slate-200 max-w-lg w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded flex items-center justify-center mx-auto mb-6 border border-rose-100">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to load</h2>
          <p className="text-slate-500 mb-8 text-sm font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Retry
          </button>
        </div>
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
        <main className="p-6 md:p-10 pt-8">
          <div className="max-w-[1600px] mx-auto">
            <div>
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
