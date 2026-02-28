import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
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
  BarChart3
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setSidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'applications', label: 'Applications', icon: Users, gradient: 'from-purple-500 to-pink-500' },
    { id: 'jobs', label: 'Job Management', icon: Briefcase, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'reports', label: 'Analytics', icon: BarChart3, gradient: 'from-amber-500 to-orange-500' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-white border-r border-gray-100 shadow-xl z-40 transition-all duration-500 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-72'}
      hidden lg:flex flex-col
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

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group
                ${isActive
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg shadow-blue-200/50'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}
              `}>
                <Icon size={16} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'} />
              </div>
              {!isCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-50 space-y-1 ${isCollapsed ? 'px-2' : ''}`}>
        <button
          onClick={() => navigate('/company-profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-all ${isCollapsed ? 'justify-center px-2' : ''}`}
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
  );
};

export default Sidebar;
