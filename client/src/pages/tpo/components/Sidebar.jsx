import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';
import { 
  FaUsers,  
  FaBriefcase, 
  FaGraduationCap, 
  FaChartBar,  
  FaCalendarAlt, 
  FaHome,
  FaSignOutAlt, 
} from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef();
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: 'text-blue-600' },
    { id: 'students', label: 'Students', icon: FaUsers, color: 'text-green-600' },
    { id: 'interviews', label: 'Interviews', icon: FaCalendarAlt, color: 'text-purple-600' },
    { id: 'jobs', label: 'Jobs and Internships', icon: FaBriefcase, color: 'text-indigo-600' },
    { id: 'reports', label: 'Reports & Analytics', icon: FaChartBar, color: 'text-red-600' }
  ];

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
          setIsProfileOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen fixed left-0 top-0 z-50`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FaGraduationCap className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gray-800">TPO Portal</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <FaGraduationCap className="text-white text-sm" />
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
              title={isCollapsed ? item.label : ''}
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

      {/* User Profile Button */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50">
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-100 transition-colors ${
              isCollapsed ? 'justify-center' : 'px-4'
            }`}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-blue-600">
                {getUserInitials(getUserDisplayName(user))}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-gray-500 truncate">TPO</p>
              </div>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mb-1 z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
