import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  User,
  Building,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  BarChart3,
  Bell,
  X
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setSidebarCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Management', icon: Briefcase },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-100 shadow-xl z-[70] transition-all duration-500 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b border-gray-50 ${isCollapsed ? 'px-4' : ''}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
              <Building className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Elevate
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Company</p>
            </div>
          </div>
        )}

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <X size={18} />
        </button>

        <button
          onClick={() => setSidebarCollapsed(!isCollapsed)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isNotification = item.id === 'notifications';

          return (
              <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded hover:-translate-y-0.5 font-medium text-sm transition-all duration-200 group border
                ${isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <div className="flex items-center gap-3 truncate">
                <div className={`
                  w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-colors relative
                  ${isActive ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-slate-200'}
                `}>
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'} />
                  {isNotification && unreadCount > 0 && isCollapsed && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                {!isCollapsed && <span className="flex-1 text-left truncate tracking-wide">{item.label}</span>}
              </div>
              
              {!isCollapsed && isNotification && unreadCount > 0 && (
                 <span className={`${isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'} text-xs font-bold px-2 py-0.5 rounded-full`}>
                   {unreadCount}
                 </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-50 space-y-1 ${isCollapsed ? 'px-2' : ''}`}>
        <button
          onClick={() => navigate('/company-profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-gray-600" />
          </div>
          {!isCollapsed && <span className="flex-1 text-left">Profile</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-all ${isCollapsed ? 'justify-center px-2' : ''}`}
        >
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
            <LogOut size={14} className="text-red-600" />
          </div>
          {!isCollapsed && <span className="flex-1 text-left">Sign Out</span>}
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
