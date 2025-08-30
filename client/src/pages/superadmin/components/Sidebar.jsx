import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaHome, 
  FaBuilding, 
  FaShieldAlt, 
  FaUserShield,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const { logout } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: 'text-blue-600' },
    { id: 'tpo-approval', label: 'TPO Approval', icon: FaShieldAlt, color: 'text-orange-600' },
    { id: 'company-approval', label: 'Company Approval', icon: FaBuilding, color: 'text-purple-600' }
  ];

  const handleLogout = async () => {
    await logout();
  };

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
        
        {/* Mobile Profile Button for Collapsed Sidebar */}
        {isCollapsed && (
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </button>
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

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">System Admin</p>
                <p className="text-xs text-gray-500">Super Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
