import React from 'react';
import { 
  FaHome, 
  FaUsers, 
  FaBuilding, 
  FaGraduationCap, 
  FaShieldAlt, 
  FaCog,
  FaUserShield,
  FaSearch,
  FaUser
} from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: 'text-blue-600' },
    { id: 'admin-approval', label: 'Admin Approval', icon: FaUserShield, color: 'text-green-600' },
    { id: 'company-approval', label: 'Company Approval', icon: FaBuilding, color: 'text-purple-600' },
    { id: 'institutions', label: 'Institutions', icon: FaGraduationCap, color: 'text-indigo-600' },
    { id: 'settings', label: 'Settings', icon: FaCog, color: 'text-gray-600' }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen fixed left-0 top-0 z-50`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <FaShieldAlt className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gray-800">Super Admin</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
            <FaShieldAlt className="text-white text-sm" />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-500'}`} />
              {!isCollapsed && (
                <span className={`font-medium ${isActive ? 'text-red-700' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
