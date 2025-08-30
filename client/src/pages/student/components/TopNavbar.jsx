import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaGraduationCap,
  FaBars
} from 'react-icons/fa';

const TopNavbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, message: 'Amazon coding test scheduled for tomorrow', time: '2 min ago' },
    { id: 2, message: 'New job matches found for your profile', time: '1 hour ago' },
    { id: 3, message: 'Practice session completed with 95% accuracy', time: '3 hours ago' }
  ];

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 h-16 fixed top-0 right-0 left-64 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaBars className="text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            
            <div>
             </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs, companies, practice tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <FaBell className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xs" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">Alex Johnson</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{user?.name || 'Alex Johnson'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'alex.johnson@elevate.edu'}</p>
                </div>
                
                <button 
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <FaUser className="text-gray-500" />
                  <span>Profile</span>
                </button>
                
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <FaCog className="text-gray-500" />
                  <span>Settings</span>
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

      {/* Notifications Panel (Hidden by default) */}
      <div className="hidden absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-800">Notifications</h3>
          <button className="text-xs text-blue-600 hover:text-blue-800">Mark all read</button>
        </div>
        
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
