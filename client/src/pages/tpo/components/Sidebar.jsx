
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

    // Width classes to handle responsive sidebar
    // On Desktop: w-64 or w-16
    // On Mobile: w-64 always (since it's a drawer)
    const containerClasses = `bg-white shadow-xl h-screen fixed top-0 left-0 z-50 flex flex-col border-r border-gray-200 transition-all duration-300 md:static ${
        isCollapsed ? 'md:w-16' : 'md:w-64'
    } w-64`;

    return (
    <div className={containerClasses}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
        {(!isCollapsed) && (
          <div className="flex items-center space-x-3 transition-opacity duration-300">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FaGraduationCap className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Elevate</span>
          </div>
        )}
        {(isCollapsed) && (
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <FaGraduationCap className="text-white text-sm" />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {(!isCollapsed) && (
                <span className="truncate">
                  {item.label}
                </span>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                  </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Button */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium shadow-sm ring-2 ring-white">
                {getUserInitials(getUserDisplayName(user))}
            </div>
            {(!isCollapsed) && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">TPO Admin</p>
              </div>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in-up origin-bottom">
              <div className="p-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Sign out</span>
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
