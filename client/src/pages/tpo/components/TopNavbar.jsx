import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Globe,
  Plus,
  X,
  MoreVertical,
  SearchIcon
} from 'lucide-react';

const TopNavbar = ({ toggleSidebar, sidebarCollapsed, isMobileSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const notificationRef = useRef();
  const profileRef = useRef();

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate('/tpo-profile');
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
          {/* Left: Mobile Menu + Context */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90"
            >
              {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest text-[10px]">TPO Admin Console</span>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-bold text-gray-800">Placement Hub</span>
            </div>

            {/* Mobile Logo Context */}
            <div className="lg:hidden font-black text-xs text-indigo-600 tracking-tighter uppercase sm:block hidden">
              Elevate TPO
            </div>
          </div>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
              <input
                type="text"
                placeholder="Search students, companies, recruitment drives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Trigger */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <Search size={18} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${showNotifications ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-200 border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-[-10px] sm:right-0 mt-3 w-[calc(100vw-32px)] sm:w-96 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-fade-in z-50">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Action Center</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{unreadCount} pending tasks</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-bold px-3 py-1.5 bg-white rounded-lg transition-all shadow-sm"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all ${!notification.isRead ? 'bg-indigo-50/30' : ''
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notification.isRead ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 font-medium mb-1 line-clamp-2">{notification.message}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{formatTime(notification.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-gray-400">
                        <Bell className="mx-auto mb-3 opacity-20" size={40} />
                        <p className="text-sm font-medium">No pending actions</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-1 sm:gap-3 pl-1 pr-1 sm:pr-3 py-1 rounded-xl transition-all ${isProfileOpen ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <span className="text-white text-sm font-bold">
                    {getUserInitials(getUserDisplayName(user))}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 md:block hidden ${isProfileOpen ? 'rotate-180' : ''}`} />
                {/* 3 Dots for mobile instead of chevron/name */}
                <MoreVertical size={18} className="text-gray-400 md:hidden block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-fade-in z-50">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{getUserDisplayName(user)}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1 truncate">{user?.collegeName || 'Placement Office'}</p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={handleProfile}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-all"
                    >
                      <User size={16} className="text-indigo-600" />
                      <span>Institute Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all mt-1"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className="lg:hidden p-4 border-t border-gray-50 animate-fade-in-down bg-white shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={16} />
              <input
                autoFocus
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
              <button
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
