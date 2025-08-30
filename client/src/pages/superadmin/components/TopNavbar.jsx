import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';
import { 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaShieldAlt,
  FaBars
} from 'react-icons/fa';

const TopNavbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    if (!notification.isRead) {
      markAsRead([notification._id]);
    }
    
    // Navigate to the notification link if available
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
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  };

  // Close dropdowns when clicking outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">


          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={getUserDisplayName(user)}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-medium">
                    {getUserInitials(user?.name)}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">{getUserDisplayName(user)}</p>
                <p className="text-xs text-gray-500">Super Administrator</p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{getUserDisplayName(user)}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@elevate.com'}</p>
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
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
