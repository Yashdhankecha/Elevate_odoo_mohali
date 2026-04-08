import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';
import {
  Home,
  Briefcase,
  FileText,
  Code2,
  History,
  Sparkles,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  CheckSquare,
  Bell,
  User,
  LogOut
} from 'lucide-react';

// Map section key → URL slug (must match StudentDashboard SECTION_TO_SLUG)
const SECTION_SLUG = {
  dashboard: null,           // → /student-dashboard
  jobs: 'browse-jobs',
  internships: 'internships',
  applications: 'applications',
  practice: 'practice-hub',
  resume: 'resume-builder',
  'ai-coach': 'ai-coach',
  'profile-approval': 'profile-approval',
};

const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setSidebarCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const notificationRef = useRef();

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
    { id: 'internships', label: 'Internships', icon: GraduationCap },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'practice', label: 'Practice Hub', icon: Code2 },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'ai-coach', label: 'AI Career Coach', icon: Sparkles },
  ];

  const handleNavigation = (sectionId) => {
    const slug = SECTION_SLUG[sectionId];
    if (slug) {
      navigate(`/student-dashboard/${slug}`);
    } else {
      navigate('/student-dashboard');
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-[70]
        transition-transform duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className={`flex items-center justify-between p-6 border-b border-slate-200 ${isCollapsed ? 'px-4' : ''}`}>
            {isCollapsed && !isMobileOpen ? (
              <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center shadow-sm mx-auto">
                <GraduationCap className="text-white w-5 h-5" strokeWidth={2} />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center shadow-sm">
                  <GraduationCap className="text-white w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                    ELEVATE
                  </h1>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Student Portal</p>
                </div>
              </div>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                     w-full flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm
                    transition-colors group border
                    ${isActive
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }
                    ${isCollapsed ? 'justify-center px-2' : ''}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`
                    w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-colors
                    ${isActive
                      ? 'bg-white/10'
                      : 'bg-slate-100 group-hover:bg-slate-200'
                    }
                  `}>
                    <Icon size={16} strokeWidth={2} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'} />
                  </div>

                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Items */}
          <div className={`p-4 border-t border-slate-200 space-y-1 relative ${isCollapsed ? 'px-2' : ''}`} ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <div className="relative w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Bell size={16} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-slate-900 border border-slate-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
            </button>

            {showNotifications && (
              <div className={`absolute bottom-full left-4 mb-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden z-[80] ${isCollapsed ? 'w-72 left-16' : 'w-80'}`}>
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{unreadCount} unread</p>
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
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-slate-50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notification.isRead ? 'bg-slate-900' : 'bg-slate-300'}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-800 font-medium mb-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-slate-500">{formatTime(notification.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 font-bold text-sm">No notifications</div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => { navigate('/student-profile'); setIsMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-slate-600" />
              </div>
              {!isCollapsed && <span className="flex-1 text-left">Profile</span>}
            </button>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm text-rose-600 hover:bg-rose-50 transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <div className="w-8 h-8 rounded bg-rose-50 flex items-center justify-center flex-shrink-0">
                <LogOut size={16} className="text-rose-600" />
              </div>
              {!isCollapsed && <span className="flex-1 text-left">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Collapse Trigger */}
      <button
        onClick={() => setSidebarCollapsed(!isCollapsed)}
        className={`hidden lg:flex fixed top-8 w-7 h-7 items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors z-[80] shadow-sm mb-4`}
        style={{ left: isCollapsed ? '72px' : '246px' }}
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={2} /> : <ChevronLeft size={14} strokeWidth={2} />}
      </button>
    </>
  );
};

export default Sidebar;
