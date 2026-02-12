import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCamera, FaSave, FaArrowLeft, FaLock, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateProfile, changePassword, deleteAccount, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });
    const [deletePassword, setDeletePassword] = useState('');

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(profileData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        setLoading(true);
        try {
            await deleteAccount(deletePassword);
            toast.success('Account deleted');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Failed to delete account');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'security', label: 'Security', icon: FaLock },
        { id: 'danger', label: 'Danger Zone', icon: FaTrash },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                        <FaArrowLeft size={14} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                        ? tab.id === 'danger' ? 'bg-red-50 text-red-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={14} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input name="name" value={profileData.name} onChange={handleProfileChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input name="email" value={profileData.email} disabled
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input name="phone" value={profileData.phone} onChange={handleProfileChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all">
                                <FaSave size={14} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Change Password</h3>
                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                                <input type="password" value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                <input type="password" value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                                <input type="password" value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all">
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Danger Zone Tab */}
                {activeTab === 'danger' && (
                    <div className="bg-white rounded-2xl border-2 border-red-100 p-8">
                        <h3 className="text-lg font-bold text-red-600 mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-500 mb-6">This action is permanent and cannot be undone. All your data will be lost.</p>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Enter your password to confirm</label>
                            <input type="password" value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full px-4 py-3 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <button onClick={handleDeleteAccount} disabled={loading || !deletePassword}
                            className="w-full py-3.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all">
                            {loading ? 'Deleting...' : 'Permanently Delete Account'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
