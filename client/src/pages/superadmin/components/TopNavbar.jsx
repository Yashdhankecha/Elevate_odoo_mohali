import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Menu,
  ChevronDown,
  ShieldAlert,
  SearchIcon,
  Globe
} from 'lucide-react';

const TopNavbar = ({ toggleSidebar, sidebarCollapsed }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef();

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Menu & Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <Menu size={18} />
            </button>
            
            <div className="hidden lg:flex items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Command</span>
               <span className="text-slate-200">/</span>
               <span className="text-sm font-bold text-slate-900">Root Access</span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={14} />
              <input
                type="text"
                placeholder="Global system search: institutions, users, logs..."
                className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* System Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">Core Online</span>
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
              <Bell size={16} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-50 transition-all"
              >
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                  <User size={14} className="text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-tight">Root Administrator</p>
                  <p className="text-[10px] text-slate-500 font-medium tracking-tight">System Master</p>
                </div>
                <ChevronDown size={14} className={`hidden sm:block text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
                  <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">System Root</p>
                    <p className="text-xs text-slate-500 mt-0.5">superadmin@elevate.system</p>
                  </div>
                  
                  <div className="p-2">
                    <button onClick={() => navigate('/superadmin/settings')} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all">
                      <Settings size={14} />
                      System Config
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-3 transition-all mt-1">
                      <LogOut size={14} />
                      Zero Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
