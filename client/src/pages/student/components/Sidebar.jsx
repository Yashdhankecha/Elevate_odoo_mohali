import React, { useState } from 'react';
import {
  Home,
  Briefcase,
  FileText,
  Code2,
  History,
  Sparkles,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  X,
  LayoutGrid
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setSidebarCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
    { id: 'internships', label: 'Internships', icon: GraduationCap },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'practice', label: 'Practice Hub', icon: Code2 },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'ai-coach', label: 'AI Career Coach', icon: Sparkles },
    { id: 'history', label: 'Placement History', icon: History },
  ];

  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xl z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-slate-100 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] z-[70]
        transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className={`flex items-center justify-between p-6 border-b border-slate-50 ${isCollapsed ? 'px-4' : ''}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 bg-blue-600 rounded-[1rem] flex items-center justify-center shadow-2xl shadow-blue-200">
                  <GraduationCap className="text-white w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                    ELEVATE
                  </h1>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Student Portal</p>
                </div>
              </div>
            )}
            
            {isCollapsed && (
              <div className="w-10 h-10 bg-blue-600 rounded-[1rem] flex items-center justify-center shadow-xl mx-auto">
                 <GraduationCap className="text-white w-5 h-5" strokeWidth={2.5} />
              </div>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] font-bold text-[12px]
                    transition-all duration-500 group relative
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 active:scale-95' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500
                    ${isActive 
                      ? 'bg-white/10 scale-105 shadow-inner' 
                      : 'bg-slate-50 group-hover:bg-white group-hover:shadow-lg'
                    }
                  `}>
                    <Icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
                  </div>
                  
                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}

                  {isActive && !isCollapsed && (
                    <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Desktop Collapse Trigger */}
      <button
         onClick={() => setSidebarCollapsed(!isCollapsed)}
         className={`hidden lg:flex fixed top-8 w-7 h-7 items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all z-[80] shadow-xl hover:scale-110 active:scale-95 mb-4`}
         style={{ left: isCollapsed ? '68px' : '244px' }}
      >
         {isCollapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
      </button>
    </>
  );
};

export default Sidebar;
