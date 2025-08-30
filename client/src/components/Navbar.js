import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiMenu, HiX, HiUser, HiLogout, HiViewBoards } from 'react-icons/hi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  const getDisplayName = () => {
    if (!user) return 'User';
    switch (user.role) {
      case 'student': return user.student?.name || 'Student';
      case 'company': return user.company?.companyName || 'Company';
      case 'tpo': return user.tpo?.name || 'TPO';
      default: return 'User';
    }
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'student': return '/student-dashboard';
      case 'company': return '/company-dashboard';
      case 'tpo': return '/tpo-dashboard';
      default: return '/profile';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    switch (user.role) {
      case 'student': return 'Student Dashboard';
      case 'company': return 'Company Dashboard';
      case 'tpo': return 'TPO Dashboard';
      default: return 'Dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/login" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚀</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Elevate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') || isActive('/student-dashboard') || isActive('/company-dashboard') || isActive('/tpo-dashboard') ? 'nav-link-active' : ''}`}
              >
                <HiViewBoards className="inline w-4 h-4 mr-1" />
                Dashboard
              </Link>
            )}
            
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile') ? 'nav-link-active' : ''}`}
              >
                <HiUser className="inline w-4 h-4 mr-1" />
                Profile
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={getDisplayName()}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <HiUser className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {getDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary flex items-center space-x-1"
                >
                  <HiLogout className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard') || isActive('/student-dashboard') || isActive('/company-dashboard') || isActive('/tpo-dashboard') ? 'nav-link-active' : 'nav-link'
                }`}
                onClick={closeMenu}
              >
                <HiViewBoards className="inline w-4 h-4 mr-2" />
                Dashboard
              </Link>
            )}
            
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/profile') ? 'nav-link-active' : 'nav-link'
                }`}
                onClick={closeMenu}
              >
                <HiUser className="inline w-4 h-4 mr-2" />
                Profile
              </Link>
            )}

            {isAuthenticated ? (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2 mb-3">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={getDisplayName()}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <HiUser className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {getDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <HiLogout className="inline w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
