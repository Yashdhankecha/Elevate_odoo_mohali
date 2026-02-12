import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../utils/helpers';
import { HiUser, HiMail, HiCalendar, HiShieldCheck, HiKey, HiTrash, HiBadgeCheck, HiShieldExclamation } from 'react-icons/hi';
import { Loader2, ShieldCheck, Key, Trash2, Camera, User, Mail, Calendar, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

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

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [deleteForm, setDeleteForm] = useState({ password: '' });

    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

    const handleSidebarNavigation = (section) => {
        if (section === 'profile') return;
        const routes = { student: 'student-dashboard', tpo: 'tpo-dashboard', company: 'company-dashboard', superadmin: 'superadmin-dashboard' };
        navigate(`/${routes[user?.role || 'student']}?section=${section}`);
    };

    const getRoleComponents = () => {
        const map = {
            student: { Sidebar: StudentSidebar, TopNavbar: StudentTopNavbar },
            tpo: { Sidebar: TPOSidebar, TopNavbar: TPOTopNavbar },
            company: { Sidebar: CompanySidebar, TopNavbar: CompanyTopNavbar },
            superadmin: { Sidebar: SuperadminSidebar, TopNavbar: SuperadminTopNavbar }
        };
        return map[user?.role] || map.student;
    };

    const { Sidebar, TopNavbar } = getRoleComponents();

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
        <div className="min-h-screen bg-slate-50/50 flex">
            <Sidebar activeSection="profile" setActiveSection={handleSidebarNavigation} isCollapsed={sidebarCollapsed} />

            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} relative`}>
                <TopNavbar toggleSidebar={toggleSidebar} />

                {/* Subliminal background element */}
                <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-br from-indigo-50 to-transparent -z-10 opacity-60 rounded-bl-[100px]" />

                <main className="pt-24 px-4 md:px-8 pb-12 max-w-5xl mx-auto">
                    {/* Enhanced Profile Header */}
                    <div className="glass-card rounded-[3rem] p-8 md:p-12 mb-8 animate-fade-in relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Settings className="w-32 h-32 rotate-12" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                            <div className="relative group/avatar">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-white transition-transform duration-500 group-hover/avatar:scale-105">
                                    {user?.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white uppercase">
                                            {getUserInitials(user?.name)}
                                        </div>
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 border border-slate-100">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="text-center md:text-left flex-1 space-y-4">
                                <div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{getUserDisplayName(user)}</h1>
                                        <span className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-200">{user?.role || 'User'}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-medium">
                                            <Mail className="w-4 h-4" />
                                            {user?.email}
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-sm font-medium">
                                            <Calendar className="w-4 h-4" />
                                            Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                                        </div>
                                    </div>
                                </div>
                                {user?.googleId && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                                        <HiBadgeCheck className="w-4 h-4" /> Linked with Google
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Nav Tabs */}
                        <div className="lg:col-span-1 space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1' : 'bg-white text-slate-500 hover:bg-slate-100'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            <div className="glass-card rounded-[2.5rem] p-8 md:p-10 animate-slide-up h-full">
                                {activeTab === 'security' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3 text-slate-900">
                                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                                <Key className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <h2 className="text-2xl font-extrabold tracking-tight">Access Security</h2>
                                        </div>

                                        {user?.googleId ? (
                                            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                    <HiShieldCheck className="w-8 h-8 text-indigo-500" />
                                                </div>
                                                <h4 className="text-slate-900 font-bold mb-2">Google Managed Security</h4>
                                                <p className="text-slate-500 text-sm max-w-xs mx-auto">Password management is handled by Google. To change your security settings, please visit your Google Account.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="form-label px-1">Current Password</label>
                                                        <input
                                                            type="password" name="currentPassword" required
                                                            value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                                            className="input-field" placeholder="Enter existing password"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="form-label px-1">New Password</label>
                                                            <input
                                                                type="password" name="newPassword" required
                                                                value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                                                                className="input-field" placeholder="At least 6 chars"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="form-label px-1">Confirm New Password</label>
                                                            <input
                                                                type="password" name="confirmPassword" required
                                                                value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                                                className="input-field" placeholder="Verify new password"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={loading} className="btn-primary px-8 py-4 flex items-center gap-2 font-bold shadow-lg shadow-indigo-100 ml-auto transition-all active:scale-95 disabled:opacity-50">
                                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><HiKey className="w-5 h-5" /> Update My Password</>}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'danger' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3 text-rose-600">
                                            <div className="p-3 bg-rose-50 rounded-2xl">
                                                <HiShieldExclamation className="w-6 h-6" />
                                            </div>
                                            <h2 className="text-2xl font-extrabold tracking-tight">Danger Zone</h2>
                                        </div>

                                        <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] space-y-6">
                                            <div className="space-y-2">
                                                <h4 className="text-rose-900 font-extrabold text-xl">Deactivate & Delete Account</h4>
                                                <p className="text-rose-700/80 font-medium leading-relaxed">
                                                    This action will permanently delete your profile, job applications, progress, and all associated data. This cannot be undone.
                                                </p>
                                            </div>

                                            <form onSubmit={handleDeleteSubmit} className="space-y-4">
                                                {!user?.googleId && (
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-bold text-rose-900/60 mb-2 uppercase tracking-wide">Confirm with Password</label>
                                                        <input
                                                            type="password" name="password" required
                                                            value={deleteForm.password} onChange={(e) => setDeleteForm({ password: e.target.value })}
                                                            className="w-full bg-white border-2 border-rose-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-rose-900 font-bold placeholder:text-rose-200"
                                                            placeholder="Type your password to verify"
                                                        />
                                                    </div>
                                                )}
                                                <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                                    <Trash2 className="w-5 h-5" /> {loading ? 'Deleting...' : 'PERMANENTLY DELETE ACCOUNT'}
                                                </button>
                                            </form>
                                        </div>
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