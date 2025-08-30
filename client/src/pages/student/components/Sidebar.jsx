import React, { useState } from 'react';
import { 
  FaHome, 
  FaFileAlt, 
  FaBookOpen, 
  FaChartBar, 
  FaBriefcase, 
  FaHistory,
  FaUser,
  FaSearch,
  FaBell,
  FaGraduationCap
} from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: 'text-blue-600' },
    { id: 'resume', label: 'Resume Builder', icon: FaFileAlt, color: 'text-green-600' },
    { id: 'practice', label: 'Practice Hub', icon: FaBookOpen, color: 'text-purple-600' },
    { id: 'skills', label: 'Skill Tracker', icon: FaChartBar, color: 'text-orange-600' },
    { id: 'applications', label: 'Applications', icon: FaBriefcase, color: 'text-indigo-600' },
    { id: 'history', label: 'Placement History', icon: FaHistory, color: 'text-pink-600' },
    { id: 'ai-coach', label: 'AI Career Coach', icon: FaGraduationCap, color: 'text-teal-600' }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen fixed left-0 top-0 z-50`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FaGraduationCap className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gray-800">Elevate Student</span>
          </div>
        )}
        <button
          onClick={() => setActiveSection('dashboard')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaSearch className={`text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-500'}`} />
              {!isCollapsed && (
                <span className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Alex Johnson</p>
              <p className="text-xs text-gray-500">Computer Science</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
