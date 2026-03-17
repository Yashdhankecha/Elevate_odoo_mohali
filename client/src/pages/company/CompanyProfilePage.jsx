import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../utils/helpers';
import { HiShieldCheck, HiKey, HiBadgeCheck, HiShieldExclamation } from 'react-icons/hi';
import { Loader2, ShieldCheck, Key, Trash2, Camera, Mail, Calendar, Settings, Building } from 'lucide-react';
import toast from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import CompanyProfileComponent from './components/CompanyProfile';

const CompanyProfilePage = () => {
    const { user, changePassword, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('company-details');
    const [loading, setLoading] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [deleteForm, setDeleteForm] = useState({ password: '' });

    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

    const handleSidebarNavigation = (section) => {
        if (section === 'profile') return;
        navigate(`/company-dashboard?section=${section}`);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords mismatch');
            return;
        }
        setLoading(true);
        try {
            const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            if (result.success) {
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                toast.success('Password updated successfully!');
            }
        } catch (error) {
            toast.error('Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm('IRREVERSIBLE ACTION: Are you sure you want to delete your account?')) {
            setLoading(true);
            try {
                await deleteAccount(deleteForm.password);
            } catch (error) {
                toast.error('Deletion failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const tabs = [
        { id: 'company-details', name: 'Company Details', icon: Building },
        { id: 'security', name: 'Security', icon: ShieldCheck },
        { id: 'danger', name: 'Danger Zone', icon: Trash2 }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row">
            {/* Sidebar Desktop */}
            <div className="hidden lg:block">
                <Sidebar activeSection="profile" setActiveSection={handleSidebarNavigation} isCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
            </div>

            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} relative min-w-0`}>
                <TopNavbar toggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />

                <main className="pt-8 px-4 sm:px-6 lg:px-8 pb-12 w-full max-w-[1600px] mx-auto">
                    {/* Enhanced Profile Header */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded p-6 sm:p-8 lg:p-10 mb-8 relative">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 w-full">
                            <div className="relative shrink-0">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded border border-slate-200 overflow-hidden shadow-sm bg-white">
                                    {user?.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.companyName || user.name} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-700 uppercase">
                                            {getUserInitials(user?.name)}
                                        </div>
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2 sm:p-2.5 bg-white rounded border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors z-10">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="text-center md:text-left flex-1 space-y-3 sm:space-y-4 min-w-0">
                                <div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-1 sm:mb-2">
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight truncate max-w-full">{getUserDisplayName(user)}</h1>
                                        <span className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded shrink-0">Company</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 sm:gap-2 mt-2">
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-medium text-sm sm:text-base truncate">
                                            <Mail className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{user?.email}</span>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-xs sm:text-sm font-medium">
                                            <Calendar className="w-4 h-4 shrink-0" />
                                            Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Tab Navigation */}
                    <div className="flex flex-row gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-3 rounded text-sm sm:text-base font-bold transition-colors shrink-0 border ${isActive
                                            ? tab.id === 'danger'
                                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                : 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                    <span className="whitespace-nowrap">{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded p-4 sm:p-6 lg:p-8 xl:p-10">
                        {activeTab === 'company-details' && (
                            <div className="-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-10 px-4 sm:px-6 lg:px-8 xl:px-10">
                                <CompanyProfileComponent />
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
                                    <div className="p-2 bg-slate-50 border border-slate-200 rounded shrink-0">
                                        <Key className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Access Security</h2>
                                </div>

                                {user?.googleId ? (
                                    <div className="p-6 bg-slate-50 border border-slate-200 rounded text-center">
                                        <div className="w-16 h-16 bg-white border border-slate-200 rounded flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <HiShieldCheck className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <h4 className="text-slate-900 font-bold mb-2 text-sm sm:text-base">Google Managed Security</h4>
                                        <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto">Password management is handled by Google. To change your security settings, please visit your Google Account.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePasswordSubmit} className="space-y-5 sm:space-y-6 max-w-2xl">
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="space-y-1.5 sm:space-y-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Current Password</label>
                                                <input
                                                    type="password" name="currentPassword" required
                                                    value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400" placeholder="Enter existing password"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-1.5 sm:space-y-2">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest px-1">New Password</label>
                                                    <input
                                                        type="password" name="newPassword" required
                                                        value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400" placeholder="At least 6 chars"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 sm:space-y-2">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Confirm Password</label>
                                                    <input
                                                        type="password" name="confirmPassword" required
                                                        value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400" placeholder="Verify new password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded text-sm font-bold transition-colors disabled:opacity-50 sm:ml-auto flex items-center justify-center gap-2">
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><HiKey className="w-4 h-4" /> <span>Update Password</span></>}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === 'danger' && (
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex items-center gap-3 text-rose-700 border-b border-slate-100 pb-4">
                                    <div className="p-2 bg-rose-50 border border-rose-200 rounded shrink-0">
                                        <HiShieldExclamation className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Danger Zone</h2>
                                </div>

                                <div className="p-5 sm:p-6 bg-white border border-rose-200 rounded shadow-sm space-y-4 sm:space-y-6 max-w-2xl">
                                    <div className="space-y-1 sm:space-y-2">
                                        <h4 className="text-rose-700 font-bold text-lg sm:text-xl">Deactivate & Delete Account</h4>
                                        <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
                                            This action will permanently delete your profile, job postings, applications, and all associated data. This cannot be undone.
                                        </p>
                                    </div>

                                    <form onSubmit={handleDeleteSubmit} className="space-y-4">
                                        {!user?.googleId && (
                                            <div className="space-y-1.5 sm:space-y-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Confirm with Password</label>
                                                <input
                                                    type="password" name="password" required
                                                    value={deleteForm.password} onChange={(e) => setDeleteForm({ password: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                                                    placeholder="Type your password to verify"
                                                />
                                            </div>
                                        )}
                                        <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 text-white font-bold rounded hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                                            <Trash2 className="w-4 h-4 shrink-0" /> {loading ? 'Deleting...' : 'Permanently Delete Account'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyProfilePage;
