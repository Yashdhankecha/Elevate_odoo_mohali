import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { getUserDisplayName, getUserInitials } from '../../../utils/helpers';
import {
  BarChart3,
  Users,
  Building2,
  Briefcase,
  Calendar,
  FilePieChart,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  X,
  Bell,
  LayoutGrid
} from 'lucide-react';

const Sidebar = ({
  activeSection,
  setActiveSection,
  isCollapsed,
  setSidebarCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'companies', label: 'Company Partners', icon: Building2 },
    { id: 'drive-requests', label: 'Drive Requests', icon: Briefcase },
    { id: 'interviews', label: 'Interview Desk', icon: Calendar },
    { id: 'reports', label: 'Reports & Analytics', icon: FilePieChart },
  ];

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

  const SidebarContent = () => (
    <>
      {/* TPO Branding Area */}
      <div className={`p-8 border-b border-slate-50 flex items-center justify-between ${isCollapsed && !isMobileOpen ? 'px-6' : ''}`}>
        <div className="flex items-center gap-4 animate-fade-in transition-all duration-300">
          <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center shadow-sm">
            <ShieldCheck className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">ELEVATE</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">TPO Admin</p>
            </div>
          )}
        </div>

        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
            <X size={20} />
          </button>
        )}

        {(!isCollapsed && !isMobileOpen) && (
          <button
            onClick={() => setSidebarCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-10 w-8 h-8 hidden lg:flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-90`}
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobileOpen) setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm transition-all duration-300 group relative
                ${isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }
                ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}
              `}
              title={isCollapsed && !isMobileOpen ? item.label : ''}
            >
              <div className={`
                w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-all duration-300
                ${isActive ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-sm'}
              `}>
                <Icon size={18} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
              </div>
              {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left truncate">{item.label}</span>}
              {isActive && (!isCollapsed || isMobileOpen) && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>


      {/* Footer Navigation */}
      <div className={`p-6 border-t border-slate-50 relative ${isCollapsed && !isMobileOpen ? 'px-6' : ''}`} ref={notificationRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group mb-2 ${isCollapsed && !isMobileOpen ? 'justify-center px-0 mb-4' : ''}`}
        >
          <div className="relative w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white shadow-sm border border-transparent group-hover:border-slate-100 transition-all">
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          {(!isCollapsed || isMobileOpen) && (
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
          <div className={`absolute bottom-full left-4 mb-2 bg-white rounded border border-slate-100 shadow-sm overflow-hidden animate-fade-in z-[80] ${isCollapsed && !isMobileOpen ? 'w-72 left-16' : 'w-80'}`}>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                <p className="text-xs text-slate-500 mt-0.5">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold px-3 py-1.5 bg-white rounded-lg hover:bg-indigo-50 transition-all"
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
                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-all ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notification.isRead ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
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
          onClick={() => {
            navigate('/tpo-profile');
            if (isMobileOpen) setIsMobileOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group mb-2 ${isCollapsed && !isMobileOpen ? 'justify-center px-0 mb-4' : ''}`}
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-white shadow-sm border border-transparent group-hover:border-slate-100 transition-all">
            <User size={14} />
          </div>
          {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left">My Profile</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all active:scale-95 group ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
        >
          <div className="w-8 h-8 rounded bg-rose-100 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
            <LogOut size={14} strokeWidth={2} />
          </div>
          {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left">Log out</span>}
        </button>
      </div>

      {/* Desktop Collapse Trigger */}
      {!isMobileOpen && (
        <button
          onClick={() => setSidebarCollapsed(!isCollapsed)}
          className={`hidden lg:flex fixed top-10 w-8 h-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-900 hover:text-white transition-all z-[80] shadow-sm hover:scale-110 active:scale-95 mb-4`}
          style={{ left: isCollapsed ? '80px' : '272px' }}
        >
          {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-100 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.03)] z-[70] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
