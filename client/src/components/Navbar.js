import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bell, 
  Mail, 
  ChevronDown, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Home,
  Briefcase,
  Users,
  Calendar,
  BookOpen,
  BarChart3,
  FileText,
  Target,
  Award,
  Building2,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown and menu on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  // Role-based navigation menus
  const getNavigationItems = () => {
    const role = user?.role || 'student';
    
    const navigationMenus = {
      student: [
        { label: 'Dashboard', path: '/student-dashboard', icon: Home },
        { label: 'Job Applications', path: '/job-applications', icon: Briefcase },
        { label: 'Resume Builder', path: '/resume-builder', icon: FileText },
        { label: 'Practice Hub', path: '/practice-hub', icon: Target },
        { label: 'Skill Tracker', path: '/skill-tracker', icon: BarChart3 },
        { label: 'Career Timeline', path: '/career-timeline', icon: Calendar },
        { label: 'AI Coach', path: '/ai-career-coach', icon: Award }
      ],
      company: [
        { label: 'Dashboard', path: '/company-dashboard', icon: Home },
        { label: 'Job Management', path: '/company-dashboard', icon: Briefcase },
        { label: 'Applications', path: '/company-dashboard', icon: Users },
        { label: 'Interviews', path: '/company-dashboard', icon: Calendar },
        { label: 'Announcements', path: '/company-dashboard', icon: MessageSquare },
        { label: 'Company Profile', path: '/company-dashboard', icon: Building2 }
      ],
      tpo: [
        { label: 'Dashboard', path: '/tpo-dashboard', icon: Home },
        { label: 'Students', path: '/tpo-dashboard', icon: Users },
        { label: 'Companies', path: '/tpo-dashboard', icon: Building2 },
        { label: 'Job Postings', path: '/tpo-dashboard', icon: Briefcase },
        { label: 'Placements', path: '/tpo-dashboard', icon: Award },
        { label: 'Analytics', path: '/tpo-dashboard', icon: BarChart3 }
      ],
      superadmin: [
        { label: 'Dashboard', path: '/superadmin-dashboard', icon: Home },
        { label: 'Users', path: '/superadmin-dashboard', icon: Users },
        { label: 'Colleges', path: '/superadmin-dashboard', icon: BookOpen },
        { label: 'Companies', path: '/superadmin-dashboard', icon: Building2 },
        { label: 'System', path: '/superadmin-dashboard', icon: Settings },
        { label: 'Analytics', path: '/superadmin-dashboard', icon: BarChart3 }
      ]
    };

    return navigationMenus[role] || navigationMenus.student;
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="w-full bg-gradient-to-r from-white via-blue-50 to-purple-50 backdrop-blur-sm shadow-lg border-b border-blue-100/50 sticky top-0 z-40">
      {/* Top Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand Section */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Elevate
            </span>
            <span className="text-xs text-gray-600">
              {user?.role === 'student' && 'Student Portal'}
              {user?.role === 'company' && 'Recruiter Workspace'}
              {user?.role === 'tpo' && 'TPO Management'}
              {user?.role === 'superadmin' && 'Admin Panel'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-white/60 transition-all group"
              >
                <Icon className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden relative" ref={menuRef}>
          <button
            className="p-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-blue-300/50 transition-all shadow-sm group"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            )}
          </button>

          {/* Mobile Menu Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="font-medium text-gray-900">Navigation</div>
                <div className="text-sm text-gray-500 capitalize">{user?.role || 'Student'} Menu</div>
              </div>
              
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50/50 transition-colors flex items-center gap-3"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 text-gray-500" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar - Hidden on mobile */}
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2.5 w-64 lg:w-80 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 text-sm placeholder-gray-400 shadow-sm transition-all hover:bg-white/90"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button className="relative p-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-blue-300/50 transition-all shadow-sm group">
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 font-medium shadow-lg animate-pulse">
                3
              </span>
            </button>
          </div>

          {/* Messages */}
          <button className="p-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-blue-300/50 transition-all shadow-sm group">
            <Mail className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-blue-300/50 transition-all shadow-sm group"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name || user.username || 'User'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {(user?.name || user?.username || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-800 text-sm max-w-[120px] truncate">
                  {user?.name || user?.username || 'User'}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || 'Student'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-medium text-gray-900">{user?.name || user?.username || 'User'}</div>
                  <div className="text-sm text-gray-500">{user?.email || 'user@example.com'}</div>
                </div>
                
                <button
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50/50 transition-colors flex items-center gap-3"
                  onClick={handleProfile}
                >
                  <User className="w-4 h-4 text-gray-500" />
                  View Profile
                </button>
                
                <button
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50/50 transition-colors flex items-center gap-3"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  Settings
                </button>
                
                <div className="border-t border-gray-100 mt-1">
                  <button
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50/50 transition-colors flex items-center gap-3"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
