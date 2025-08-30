import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { HiUser, HiMail, HiCalendar, HiCamera, HiPencil, HiTrash, HiShieldCheck, HiKey } from 'react-icons/hi';

const Profile = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    profilePicture: user?.profilePicture || ''
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete account form state
  const [deleteForm, setDeleteForm] = useState({
    password: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileForm.username) {
      newErrors.username = 'Username is required';
    } else if (profileForm.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileForm.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (profileForm.profilePicture && !/^https?:\/\/.+/.test(profileForm.profilePicture)) {
      newErrors.profilePicture = 'Profile picture must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      const result = await updateProfile(profileForm);
      if (result.success) {
        setProfileForm({
          username: user?.username || '',
          profilePicture: user?.profilePicture || ''
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (result.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    
    if (!deleteForm.password) {
      setErrors({ password: 'Password is required for account deletion' });
      return;
    }

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        await deleteAccount(deleteForm.password);
      } catch (error) {
        console.error('Account deletion error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: HiUser },
    { id: 'security', name: 'Security', icon: HiShieldCheck },
    { id: 'danger', name: 'Danger Zone', icon: HiTrash }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <HiUser className="w-12 h-12 text-primary-600" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
              <HiCamera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <HiCalendar className="w-4 h-4 mr-1" />
              <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
            {user?.googleId && (
              <div className="flex items-center mt-2 text-sm text-green-600">
                <HiShieldCheck className="w-4 h-4 mr-1" />
                <span>Google Account</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              
              <div>
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="profilePicture" className="form-label">Profile Picture URL</label>
                <input
                  type="url"
                  id="profilePicture"
                  name="profilePicture"
                  value={profileForm.profilePicture}
                  onChange={handleProfileChange}
                  className={`input-field ${errors.profilePicture ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.profilePicture && (
                  <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <HiPencil className="w-4 h-4" />
                  <span>{loading ? 'Updating...' : 'Update Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              {user?.googleId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <HiShieldCheck className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Google Account
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Password changes are not available for Google accounts. 
                        You can change your password through your Google account settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!user?.googleId && (
                <>
                  <div>
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={`input-field ${errors.currentPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={`input-field ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`input-field ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <HiKey className="w-4 h-4" />
                      <span>{loading ? 'Changing...' : 'Change Password'}</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
              
              {user?.googleId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <HiShieldCheck className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Google Account
                      </h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Account deletion is not available for Google accounts. 
                        You can delete your account through your Google account settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!user?.googleId && (
                <form onSubmit={handleDeleteSubmit} className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <HiTrash className="h-5 w-5 text-red-400 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Delete Account
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          Once you delete your account, there is no going back. 
                          Please be certain.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deletePassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="deletePassword"
                      name="password"
                      value={deleteForm.password}
                      onChange={handleDeleteChange}
                      className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your password to confirm deletion"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-danger flex items-center space-x-2"
                    >
                      <HiTrash className="w-4 h-4" />
                      <span>{loading ? 'Deleting...' : 'Delete Account'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
