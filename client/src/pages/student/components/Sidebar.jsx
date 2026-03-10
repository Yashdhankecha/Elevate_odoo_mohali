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
  history: 'history',
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
    { id: 'history', label: 'Placement History', icon: History },
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
          className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xl z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-slate-100 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] z-[70]
        transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className={`flex items-center justify-between p-6 border-b border-slate-50 ${isCollapsed ? 'px-4' : ''}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 bg-blue-600 rounded-[1rem] flex items-center justify-center shadow-2xl shadow-blue-200">
                  <GraduationCap className="text-white w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                    ELEVATE
                  </h1>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Student Portal</p>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div className="w-10 h-10 bg-blue-600 rounded-[1rem] flex items-center justify-center shadow-xl mx-auto">
                <GraduationCap className="text-white w-5 h-5" strokeWidth={2.5} />
              </div>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
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
                    w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] font-bold text-[12px]
                    transition-all duration-500 group relative
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 active:scale-95'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500
                    ${isActive
                      ? 'bg-white/10 scale-105 shadow-inner'
                      : 'bg-slate-50 group-hover:bg-white group-hover:shadow-lg'
                    }
                  `}>
                    <Icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
                  </div>

                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}

                  {isActive && !isCollapsed && (
                    <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Items */}
          <div className={`p-4 border-t border-slate-50 space-y-1 relative ${isCollapsed ? 'px-2' : ''}`} ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="relative w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                <Bell size={16} className="text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
            </button>

            {showNotifications && (
              <div className={`absolute bottom-full left-4 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in z-[80] ${isCollapsed ? 'w-72 left-16' : 'w-80'}`}>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100 flex items-center justify-between">
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
                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-all ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
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
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-slate-500" />
              </div>
              {!isCollapsed && <span className="flex-1 text-left">Profile</span>}
            </button>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                <LogOut size={16} className="text-rose-500" />
              </div>
              {!isCollapsed && <span className="flex-1 text-left">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Collapse Trigger */}
      <button
        onClick={() => setSidebarCollapsed(!isCollapsed)}
        className={`hidden lg:flex fixed top-8 w-7 h-7 items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all z-[80] shadow-xl hover:scale-110 active:scale-95 mb-4`}
        style={{ left: isCollapsed ? '68px' : '244px' }}
      >
        {isCollapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
      </button>
    </>
  );
};

export default Sidebar;
