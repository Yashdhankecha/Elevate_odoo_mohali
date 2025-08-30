import React, { useState } from 'react';
import { 
  FaCog, 
  FaSave, 
  FaUndo, 
  FaShieldAlt,
  FaServer,
  FaDatabase,
  FaGlobe,
  FaEnvelope,
  FaBell,
  FaLock,
  FaUnlock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      siteName: 'Placement Management System',
      siteDescription: 'Comprehensive placement management system for educational institutions',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      language: 'English',
      maintenanceMode: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireSpecialChars: true,
      enableCaptcha: true,
      sslEnforcement: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@system.com',
      smtpPassword: '********',
      fromEmail: 'noreply@system.com',
      fromName: 'System Admin',
      enableNotifications: true
    },
    database: {
      backupFrequency: 'daily',
      backupRetention: 30,
      autoBackup: true,
      backupLocation: '/backups',
      enableLogging: true,
      logRetention: 90
    }
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = (category) => {
    // Handle save logic
    console.log('Saving settings for:', category, settings[category]);
  };

  const handleReset = (category) => {
    // Handle reset logic
    console.log('Resetting settings for:', category);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FaCog },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'email', label: 'Email', icon: FaEnvelope },
    { id: 'database', label: 'Database', icon: FaDatabase }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
          <input
            type="text"
            value={settings.general.siteDescription}
            onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={settings.general.maintenanceMode}
            onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
            Maintenance Mode
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="twoFactorAuth"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
            Enable Two-Factor Authentication
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sslEnforcement"
            checked={settings.security.sslEnforcement}
            onChange={(e) => handleSettingChange('security', 'sslEnforcement', e.target.checked)}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="sslEnforcement" className="ml-2 block text-sm text-gray-700">
            Force SSL/HTTPS
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Minimum Length</label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireSpecialChars"
            checked={settings.security.requireSpecialChars}
            onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-700">
            Require Special Characters in Passwords
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableCaptcha"
            checked={settings.security.enableCaptcha}
            onChange={(e) => handleSettingChange('security', 'enableCaptcha', e.target.checked)}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="enableCaptcha" className="ml-2 block text-sm text-gray-700">
            Enable CAPTCHA on Login
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
          <input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
          <input
            type="text"
            value={settings.email.smtpUsername}
            onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={settings.email.smtpPassword}
              onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <FaEyeSlash className="h-4 w-4 text-gray-400" /> : <FaEye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableNotifications"
            checked={settings.email.enableNotifications}
            onChange={(e) => handleSettingChange('email', 'enableNotifications', e.target.checked)}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-700">
            Enable Email Notifications
          </label>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.database.backupFrequency}
            onChange={(e) => handleSettingChange('database', 'backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Retention (days)</label>
          <input
            type="number"
            value={settings.database.backupRetention}
            onChange={(e) => handleSettingChange('database', 'backupRetention', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Location</label>
          <input
            type="text"
            value={settings.database.backupLocation}
            onChange={(e) => handleSettingChange('database', 'backupLocation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Log Retention (days)</label>
          <input
            type="number"
            value={settings.database.logRetention}
            onChange={(e) => handleSettingChange('database', 'logRetention', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoBackup"
            checked={settings.database.autoBackup}
            onChange={(e) => handleSettingChange('database', 'autoBackup', e.target.checked)}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
            Enable Automatic Backups
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableLogging"
            checked={settings.database.enableLogging}
            onChange={(e) => handleSettingChange('database', 'enableLogging', e.target.checked)}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="enableLogging" className="ml-2 block text-sm text-gray-700">
            Enable Database Logging
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'email':
        return renderEmailSettings();
      case 'database':
        return renderDatabaseSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCog className="text-gray-600" />
            System Settings
          </h2>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-gray-500 text-gray-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={() => handleReset(activeTab)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FaUndo className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => handleSave(activeTab)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FaSave className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
