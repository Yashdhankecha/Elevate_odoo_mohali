import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChartBar, 
  FaBriefcase, 
  FaUsers, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaCog,
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaBuilding
} from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'jobs', label: 'Job Management', icon: FaBriefcase },
    { id: 'applications', label: 'Applications', icon: FaUsers },
    { id: 'interviews', label: 'Interviews', icon: FaCalendarAlt },
    { id: 'reports', label: 'Reports', icon: FaFileAlt },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
  };

  // Close dropdowns when clicking outside
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
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo/Brand */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaBuilding className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Company Portal</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <FaBuilding className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section - Profile */}
      <div className="border-t border-gray-200 p-4">
        {/* Profile Section */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {getUserInitials(getUserDisplayName(user))}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-800">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-gray-500">Company</p>
              </div>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{getUserDisplayName(user)}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              
              <button 
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <FaUser className="text-gray-500" />
                <span>Profile</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <FaSignOutAlt className="text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
