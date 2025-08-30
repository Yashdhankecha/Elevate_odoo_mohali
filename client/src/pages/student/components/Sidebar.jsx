import React, { useState } from 'react';
import { 
  FaHome, 
  FaFileAlt, 
  FaBookOpen, 
  FaChartBar, 
  FaBriefcase, 
  FaHistory,
  FaUser,
  FaBell,
  FaGraduationCap,
  FaSearch
} from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const { user } = useAuth();
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: 'text-blue-600' },
    { id: 'resume', label: 'Resume Builder', icon: FaFileAlt, color: 'text-green-600' },
    { id: 'practice', label: 'Practice Hub', icon: FaBookOpen, color: 'text-purple-600' },
    { id: 'skills', label: 'Skill Tracker', icon: FaChartBar, color: 'text-orange-600' },
    { id: 'applications', label: 'Applications', icon: FaBriefcase, color: 'text-indigo-600' },
    { id: 'jobs', label: 'Browse Jobs', icon: FaSearch, color: 'text-yellow-600' },
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
    </div>
  );
};

export default Sidebar;
