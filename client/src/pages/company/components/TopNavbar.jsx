import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaBars, 
  FaBell, 
  FaSearch, 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt,
  FaEnvelope
} from 'react-icons/fa';

const TopNavbar = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, message: 'New application received for Software Engineer', time: '2 min ago', unread: true },
    { id: 2, message: 'Interview scheduled for tomorrow at 10 AM', time: '1 hour ago', unread: true },
    { id: 3, message: 'Job posting deadline approaching', time: '3 hours ago', unread: false },
  ];

  const handleProfile = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  return (
    <div className="fixed top-0 right-0 left-0 bg-white shadow-sm border-b border-gray-200 z-30 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaBars className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs, applications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaBell className="w-5 h-5 text-gray-600" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FaEnvelope className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaUserCircle className="w-8 h-8 text-gray-600" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">Sarah Johnson</p>
                <p className="text-xs text-gray-500">HR Manager</p>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{user?.name || 'Sarah Johnson'}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'sarah@techcorp.com'}</p>
                </div>
                <div className="py-2">
                  <button 
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaUserCircle className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                    <FaCog className="w-4 h-4" />
                    Settings
                  </button>
                  <hr className="my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
