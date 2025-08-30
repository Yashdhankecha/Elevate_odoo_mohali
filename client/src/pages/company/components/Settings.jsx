import React, { useState } from 'react';
import { 
  FaCog, 
  FaUser, 
  FaBell, 
  FaShieldAlt, 
  FaGlobe, 
  FaSave 
} from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'preferences', label: 'Preferences', icon: FaGlobe }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'preferences' && <PreferenceSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    phone: '+91 9876543210',
    role: 'HR Manager',
    department: 'Human Resources'
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaSave className="w-4 h-4" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    interviewReminders: true,
    weeklyReports: false
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h2>
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-sm text-gray-600">
                Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
            </div>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Change Password</h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreferenceSettings = () => {
  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'IST (UTC+5:30)',
    dateFormat: 'DD/MM/YYYY',
    theme: 'Light'
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
            <option value="UTC">UTC</option>
            <option value="EST (UTC-5)">EST (UTC-5)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
          <select
            value={preferences.theme}
            onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="Auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Settings;
