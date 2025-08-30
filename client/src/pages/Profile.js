import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../utils/helpers';
import { HiUser, HiMail, HiCalendar, HiShieldCheck, HiKey, HiTrash } from 'react-icons/hi';

// Import role-specific components
import StudentSidebar from './student/components/Sidebar';
import StudentTopNavbar from './student/components/TopNavbar';
import TPOSidebar from './tpo/components/Sidebar';
import TPOTopNavbar from './tpo/components/TopNavbar';
import CompanySidebar from './company/components/Sidebar';
import CompanyTopNavbar from './company/components/TopNavbar';
import SuperadminSidebar from './superadmin/components/Sidebar';
import SuperadminTopNavbar from './superadmin/components/TopNavbar';

const Profile = () => {
  const { user, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('security');
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle sidebar navigation
  const handleSidebarNavigation = (section) => {
    if (section === 'profile') {
      // Already on profile page, do nothing
      return;
    }
    
    // Navigate to appropriate dashboard based on user role
    switch (user?.role) {
      case 'student':
        navigate(`/student-dashboard?section=${section}`);
        break;
      case 'tpo':
        navigate(`/tpo-dashboard?section=${section}`);
        break;
      case 'company':
        navigate(`/company-dashboard?section=${section}`);
        break;
      case 'superadmin':
        navigate(`/superadmin-dashboard?section=${section}`);
        break;
      default:
        navigate(`/student-dashboard?section=${section}`);
    }
  };

  // Helper function to get role-specific components
  const getRoleComponents = () => {
    switch (user?.role) {
      case 'student':
        return {
          Sidebar: StudentSidebar,
          TopNavbar: StudentTopNavbar
        };
      case 'tpo':
        return {
          Sidebar: TPOSidebar,
          TopNavbar: TPOTopNavbar
        };
      case 'company':
        return {
          Sidebar: CompanySidebar,
          TopNavbar: CompanyTopNavbar
        };
      case 'superadmin':
        return {
          Sidebar: SuperadminSidebar,
          TopNavbar: SuperadminTopNavbar
        };
      default:
        return {
          Sidebar: StudentSidebar,
          TopNavbar: StudentTopNavbar
        };
    }
  };

  const { Sidebar, TopNavbar } = getRoleComponents();

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (result.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Password changed successfully!');
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        await deleteAccount(deleteForm.password);
      } catch (error) {
        console.error('Account deletion error:', error);
        alert('Failed to delete account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };



  const tabs = [
    { id: 'security', name: 'Change Password', icon: HiShieldCheck },
    { id: 'danger', name: 'Delete Account', icon: HiTrash }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeSection="profile" 
        setActiveSection={handleSidebarNavigation}
        isCollapsed={sidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Navbar */}
        <TopNavbar toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <main className="pt-16 px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {getUserInitials(user?.name)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{getUserDisplayName(user)}</h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <HiCalendar className="w-4 h-4 mr-1" />
                    <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <span className="capitalize font-medium">{user?.role || 'User'}</span>
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
                            ? 'border-blue-500 text-blue-600'
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
                {/* Security Settings Tab */}
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
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
                          >
                            <HiKey className="w-4 h-4" />
                            <span>{loading ? 'Changing...' : 'Change Password'}</span>
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                )}



                {/* Delete Account Tab */}
                {activeTab === 'danger' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-red-900 mb-4">Delete Account</h3>
                    
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
                          <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            id="deletePassword"
                            name="password"
                            value={deleteForm.password}
                            onChange={handleDeleteChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Enter your password to confirm deletion"
                            required
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
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
        </main>
      </div>
    </div>
  );
};

export default Profile;
