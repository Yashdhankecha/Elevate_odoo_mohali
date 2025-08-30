import React, { useState } from 'react';
import { 
  FaCog, 
  FaSave, 
  FaBell, 
  FaUser, 
  FaShieldAlt,
  FaPalette,
  FaGlobe,
  FaEnvelope,
  FaKey,
  FaDatabase,
  FaDownload,
  FaUpload,
  FaTrash,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      placementUpdates: true,
      driveReminders: true,
      studentAlerts: true
    },
    appearance: {
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analytics: true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'privacy', label: 'Privacy & Security', icon: FaShieldAlt },
    { id: 'data', label: 'Data Management', icon: FaDatabase }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCog className="text-gray-600" />
            Settings
          </h2>
          <p className="text-gray-600">Manage your account preferences and dashboard settings</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaSave className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Profile Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Dr. Sarah Chen"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="sarah.chen@elevate.edu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      defaultValue="Training & Placement Office"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      defaultValue="Experienced Training & Placement Officer with 8+ years of experience in student placement and career development."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive real-time push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Placement Updates</h4>
                      <p className="text-sm text-gray-600">Get notified about new placements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.placementUpdates}
                        onChange={(e) => handleSettingChange('notifications', 'placementUpdates', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Drive Reminders</h4>
                      <p className="text-sm text-gray-600">Reminders for upcoming placement drives</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.driveReminders}
                        onChange={(e) => handleSettingChange('notifications', 'driveReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Appearance Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Compact Mode</h4>
                      <p className="text-sm text-gray-600">Reduce spacing for more content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.appearance.compactMode}
                        onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Security */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Privacy & Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="contacts">Contacts Only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Data Analytics</h4>
                      <p className="text-sm text-gray-600">Allow usage analytics to improve the platform</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.analytics}
                        onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">Export Data</h4>
                      <FaDownload className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Download all your data in JSON format</p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                      <FaDownload className="w-4 h-4" />
                      Export Data
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">Import Data</h4>
                      <FaUpload className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Import data from a JSON file</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FaUpload className="w-4 h-4" />
                      Import Data
                    </button>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-800">Delete Account</h4>
                      <FaTrash className="text-red-400" />
                    </div>
                    <p className="text-sm text-red-600 mb-3">Permanently delete your account and all data</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                      <FaTrash className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
