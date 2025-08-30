import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Mail, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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

  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-900">Placement Command Center</span>
        <span className="text-xs text-gray-500">Welcome back! Here's your placement overview</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search students, companies, jobs..."
            className="rounded-full border border-gray-200 px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm bg-gray-50"
          />
        </div>
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">7</span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <Mail className="w-5 h-5 text-gray-600" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {user?.username ? user.username[0].toUpperCase() : 'U'}
              </div>
            )}
            <span className="font-medium text-gray-800 text-sm max-w-[120px] truncate">
              {user?.username || 'User'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50 animate-fade-in">
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                onClick={handleProfile}
              >
                Profile View
              </button>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
