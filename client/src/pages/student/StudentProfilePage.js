import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../utils/helpers';
import { HiShieldCheck, HiKey, HiBadgeCheck, HiShieldExclamation } from 'react-icons/hi';
import { Loader2, ShieldCheck, Key, Trash2, Camera, Mail, Calendar, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

const StudentProfilePage = () => {
    const { user, changePassword, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('security');
    const [loading, setLoading] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [deleteForm, setDeleteForm] = useState({ password: '' });

    const toggleSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const handleSidebarNavigation = (section) => {
        if (section === 'profile') return;
        navigate(`/student-dashboard?section=${section}`);
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
        { id: 'security', name: 'Security', icon: ShieldCheck },
        { id: 'danger', name: 'Danger Zone', icon: Trash2 }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px]" />
            </div>

            <Sidebar
                activeSection="profile"
                setActiveSection={handleSidebarNavigation}
                isCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                isMobileOpen={isMobileSidebarOpen}
                setIsMobileOpen={setIsMobileSidebarOpen}
            />

            <div className={`
                transition-all duration-500 ease-in-out min-h-screen flex-1 relative z-10 min-w-0
                ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
            `}>
                <TopNavbar toggleSidebar={toggleSidebar} isMobileSidebarOpen={isMobileSidebarOpen} />

                <main className="p-4 sm:p-6 md:p-10 pt-8">
                    <div className="max-w-[1600px] mx-auto animate-fade-in">
                        {/* Profile Header */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 animate-fade-in relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <Settings className="w-32 h-32 rotate-12" />
                            </div>

                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                                <div className="relative group/avatar shrink-0">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white transition-transform duration-500 group-hover/avatar:scale-105 bg-white">
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white uppercase">
                                                {getUserInitials(user?.name)}
                                            </div>
                                        )}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 p-2.5 sm:p-3 bg-white rounded-2xl shadow-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 border border-slate-100 z-10">
                                        <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                <div className="text-center md:text-left flex-1 space-y-3 sm:space-y-4 min-w-0">
                                    <div>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-1 sm:mb-2">
                                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight truncate">{getUserDisplayName(user)}</h1>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full shrink-0">Student</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5 sm:gap-2">
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
                                    {user?.googleId && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-bold rounded-lg border border-emerald-100/50">
                                            <HiBadgeCheck className="w-4 h-4" /> Linked with Google
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
                            {/* Nav Tabs */}
                            <div className="xl:col-span-1 space-y-2 flex flex-row xl:flex-col overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0 scrollbar-hide shrink-0">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id} onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shrink-0 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 xl:translate-x-1' : 'bg-white border border-gray-100 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                            <span className="text-sm sm:text-base whitespace-nowrap">{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Content Area */}
                            <div className="xl:col-span-3 min-w-0">
                                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 xl:p-10 animate-fade-in h-full">
                                    {activeTab === 'security' && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <div className="flex items-center gap-3 text-slate-900">
                                                <div className="p-2 sm:p-3 bg-blue-50 rounded-xl sm:rounded-2xl shrink-0">
                                                    <Key className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                                </div>
                                                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Access Security</h2>
                                            </div>

                                            {user?.googleId ? (
                                                <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                        <HiShieldCheck className="w-8 h-8 text-blue-500" />
                                                    </div>
                                                    <h4 className="text-slate-900 font-bold mb-2 text-sm sm:text-base">Google Managed Security</h4>
                                                    <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto">Password management is handled by Google. To change your security settings, please visit your Google Account.</p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handlePasswordSubmit} className="space-y-5 sm:space-y-6">
                                                    <div className="space-y-3 sm:space-y-4">
                                                        <div className="space-y-1.5 sm:space-y-2">
                                                            <label className="block text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest px-1">Current Password</label>
                                                            <input
                                                                type="password" name="currentPassword" required
                                                                value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="Enter existing password"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                            <div className="space-y-1.5 sm:space-y-2">
                                                                <label className="block text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest px-1">New Password</label>
                                                                <input
                                                                    type="password" name="newPassword" required
                                                                    value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="At least 6 chars"
                                                                />
                                                            </div>
                                                            <div className="space-y-1.5 sm:space-y-2">
                                                                <label className="block text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest px-1">Confirm Password</label>
                                                                <input
                                                                    type="password" name="confirmPassword" required
                                                                    value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="Verify new password"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center sm:justify-start gap-2 font-bold transition-all disabled:opacity-50 sm:ml-auto">
                                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><HiKey className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-sm sm:text-base">Update My Password</span></>}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'danger' && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <div className="flex items-center gap-3 text-rose-600">
                                                <div className="p-2 sm:p-3 bg-rose-50 rounded-xl sm:rounded-2xl shrink-0">
                                                    <HiShieldExclamation className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </div>
                                                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Danger Zone</h2>
                                            </div>

                                            <div className="p-5 sm:p-8 bg-rose-50 border border-rose-100 rounded-2xl sm:rounded-[2rem] space-y-4 sm:space-y-6">
                                                <div className="space-y-1 sm:space-y-2">
                                                    <h4 className="text-rose-900 font-extrabold text-lg sm:text-xl">Deactivate & Delete Account</h4>
                                                    <p className="text-rose-700/80 font-medium text-sm sm:text-base leading-relaxed">
                                                        This action will permanently delete your profile, applications, resume, and all associated data. This cannot be undone.
                                                    </p>
                                                </div>

                                                <form onSubmit={handleDeleteSubmit} className="space-y-3 sm:space-y-4">
                                                    {!user?.googleId && (
                                                        <div className="space-y-1.5 sm:space-y-2">
                                                            <label className="block text-xs sm:text-sm font-bold text-rose-900/60 uppercase tracking-wide">Confirm with Password</label>
                                                            <input
                                                                type="password" name="password" required
                                                                value={deleteForm.password} onChange={(e) => setDeleteForm({ password: e.target.value })}
                                                                className="w-full bg-white border-2 border-rose-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-rose-900 font-bold placeholder:text-rose-200"
                                                                placeholder="Type your password to verify"
                                                            />
                                                        </div>
                                                    )}
                                                    <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base">
                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> {loading ? 'Deleting...' : 'PERMANENTLY DELETE ACCOUNT'}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentProfilePage;
