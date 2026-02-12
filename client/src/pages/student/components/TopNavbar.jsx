import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';
import { 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaChevronDown
} from 'react-icons/fa';

const TopNavbar = ({ toggleSidebar, isMobileSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const notificationRef = useRef();
  const profileRef = useRef();

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead([notification._id]);
    }
    if (notification.actionLink) {
      navigate(notification.actionLink);
    }
    setShowNotifications(false);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
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
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
            >
              {isMobileSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
            
            {/* Logo - visible on mobile when sidebar closed */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="font-bold text-gray-800 text-lg">Elevate</span>
            </div>
          </div>

          {/* Center: Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
              <input
                type="text"
                placeholder="Search jobs, internships, practice tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon - Mobile Only */}
            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
              <FaSearch size={16} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <FaBell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-200">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold px-3 py-1.5 bg-white rounded-lg hover:bg-blue-50 transition-all"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all ${
                            !notification.isRead ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 font-medium mb-1 line-clamp-2">{notification.message}</p>
                              <p className="text-xs text-gray-500">{formatTime(notification.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FaBell className="text-gray-300" size={24} />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                      <button 
                        onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-bold w-full text-center py-2 hover:bg-white rounded-lg transition-all"
                      >
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 sm:gap-3 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
                  <span className="text-white text-xs font-bold">
                    {getUserInitials(getUserDisplayName(user))}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {getUserDisplayName(user)}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
                <FaChevronDown className={`hidden sm:block text-gray-400 text-xs transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">{getUserDisplayName(user)}</p>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={handleProfile}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FaUser className="text-blue-600" size={14} />
                      </div>
                      <span>My Profile</span>
                    </button>
                    
                    <div className="my-2 border-t border-gray-100"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <FaSignOutAlt className="text-red-600" size={14} />
                      </div>
                      <span>Sign Out</span>
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
