import React from 'react';
import { 
  FaChartBar, 
  FaBriefcase, 
  FaUsers, 
  FaCalendarAlt, 
  FaBullhorn, 
  FaBuilding, 
  FaFileAlt, 
  FaCog,
  FaBars
} from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'jobs', label: 'Job Management', icon: FaBriefcase },
    { id: 'applications', label: 'Applications', icon: FaUsers },
    { id: 'interviews', label: 'Interviews', icon: FaCalendarAlt },
    { id: 'announcements', label: 'Announcements', icon: FaBullhorn },
    { id: 'profile', label: 'Company Profile', icon: FaBuilding },
    { id: 'reports', label: 'Reports', icon: FaFileAlt },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo/Brand */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaBuilding className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Company Portal</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <FaBuilding className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
