import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Briefcase, 
  Calendar, 
  FilePieChart, 
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  Zap,
  Activity,
  X
} from 'lucide-react';

const Sidebar = ({ 
  activeSection, 
  setActiveSection, 
  isCollapsed, 
  setSidebarCollapsed,
  isMobileOpen,
  setIsMobileOpen 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'companies', label: 'Company Partners', icon: Building2 },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
    { id: 'interviews', label: 'Interview Desk', icon: Calendar },
    { id: 'reports', label: 'Reports & Analytics', icon: FilePieChart },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* TPO Branding Area */}
      <div className={`p-8 border-b border-slate-50 flex items-center justify-between ${isCollapsed && !isMobileOpen ? 'px-6' : ''}`}>
        <div className="flex items-center gap-4 animate-fade-in transition-all duration-300">
          <div className="w-12 h-12 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-indigo-100 border-b-2 border-indigo-700">
            <ShieldCheck className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">ELEVATE</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">TPO Admin</p>
            </div>
          )}
        </div>
        
        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
            <X size={20} />
          </button>
        )}

        {(!isCollapsed && !isMobileOpen) && (
          <button
            onClick={() => setSidebarCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-10 w-8 h-8 hidden lg:flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-lg active:scale-90`}
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobileOpen) setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-4 py-4 rounded-[1.2rem] font-bold text-[13px] transition-all duration-500 group relative
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }
                ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}
              `}
              title={isCollapsed && !isMobileOpen ? item.label : ''}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500
                ${isActive ? 'bg-white/10 scale-110 shadow-inner' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-lg'}
              `}>
                <Icon size={18} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
              </div>
              {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left truncate">{item.label}</span>}
              {isActive && (!isCollapsed || isMobileOpen) && (
                 <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>


      {/* Footer Navigation */}
      <div className={`p-6 border-t border-slate-50 ${isCollapsed && !isMobileOpen ? 'px-6' : ''}`}>
        <button 
          onClick={() => {
            navigate('/profile');
            if (isMobileOpen) setIsMobileOpen(false);
          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-[13px] text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group mb-2 ${isCollapsed && !isMobileOpen ? 'justify-center px-0 mb-4' : ''}`}
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-white shadow-sm border border-transparent group-hover:border-slate-100 transition-all">
             <User size={14} />
          </div>
          {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left">My Profile</span>}
        </button>
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.2rem] font-bold text-[13px] text-rose-500 hover:bg-rose-50 transition-all active:scale-95 group ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
             <LogOut size={16} strokeWidth={3} />
          </div>
          {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left">Log out</span>}
        </button>
      </div>

      {/* Desktop Collapse Trigger */}
      {!isMobileOpen && (
        <button
           onClick={() => setSidebarCollapsed(!isCollapsed)}
           className={`hidden lg:flex fixed top-10 w-8 h-8 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all z-[80] shadow-xl hover:scale-110 active:scale-95 mb-4`}
           style={{ left: isCollapsed ? '80px' : '272px' }}
        >
           {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-100 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] z-[70] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
