import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../services/studentApi';
import { getUserDisplayName, getUserInitials } from '../../utils/helpers';
import { HiShieldCheck, HiKey, HiBadgeCheck } from 'react-icons/hi';
import { Loader2, Camera, Mail } from 'lucide-react';
import { FaUser, FaGraduationCap, FaGlobe, FaEdit, FaSave, FaTimes, FaSpinner, FaLock, FaExclamationCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

// Valid branches matching the Student schema enum
const BRANCHES = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'AI&DS', 'Other'];

const Field = ({ label, children }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed";

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Icon className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const StudentProfilePage = () => {
    const { user, changePassword, verifyAuth } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingPic, setSavingPic] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveError, setSaveError] = useState('');   // inline error below Save

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const logoInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', phone: '', address: '', summary: '',
        degree: '', branch: '', cgpa: '', graduationYear: '',
        linkedinUrl: '', githubUrl: '', portfolioUrl: '', profilePicture: ''
    });

    /* ─── Load profile from DB ──────────────────────────────────────────────── */
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await studentApi.getProfile();
            const data = response?.data ?? response;
            if (data) {
                setFormData({
                    name: data.name || '',
                    phone: data.phone || data.phoneNumber || '',
                    address: data.address || '',
                    summary: data.summary || '',
                    degree: data.degree || '',
                    branch: data.branch || '',
                    cgpa: data.cgpa || '',
                    graduationYear: data.graduationYear || '',
                    linkedinUrl: data.linkedin || data.linkedinUrl || '',
                    githubUrl: data.github || data.githubUrl || '',
                    portfolioUrl: data.portfolio || data.portfolioUrl || '',
                    profilePicture: data.profilePicture || user?.profilePicture || ''
                });
            }
        } catch {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (user) fetchProfile(); }, [user]);

    /* ─── Helpers ────────────────────────────────────────────────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (saveError) setSaveError(''); // clear error on any edit
    };

    const handleSidebarNavigation = (section) => {
        if (section === 'profile') return;
        navigate(`/student-dashboard?section=${section}`);
    };

    /* ─── Save profile ───────────────────────────────────────────────────────── */
    const handleSaveProfile = async () => {
        setSaveError('');

        // Simple front-end validation
        if (!formData.name.trim()) { setSaveError('Name is required.'); return; }

        try {
            setSaving(true);
            const loadingToast = toast.loading('Saving profile…');
            const payload = {
                name: formData.name,
                phone: formData.phone,
                phoneNumber: formData.phone,
                summary: formData.summary,
                degree: formData.degree,
                branch: formData.branch,
                cgpa: formData.cgpa,
                graduationYear: formData.graduationYear,
                links: {
                    linkedin: formData.linkedinUrl,
                    github: formData.githubUrl,
                    portfolio: formData.portfolioUrl
                },
                address: formData.address   // flat string — backend maps to address.city
            };

            await studentApi.updateProfile(payload);
            setIsEditing(false);
            toast.success('Profile saved!', { id: loadingToast });
            verifyAuth();
            fetchProfile(); // re-sync form from DB to confirm saved values
        } catch (err) {
            const msg =
                err?.response?.data?.details ||
                err?.response?.data?.message ||
                'Failed to save profile. Please try again.';
            setSaveError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    /* ─── Profile picture ───────────────────────────────────────────────────── */
    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

        setSavingPic(true);
        try {
            const url = await studentApi.uploadProfilePicture(file);
            setFormData(prev => ({ ...prev, profilePicture: url }));
            toast.success('Profile picture updated!');
            verifyAuth();
        } catch {
            toast.error('Failed to upload picture');
        } finally {
            setSavingPic(false);
        }
    };

    /* ─── Password ──────────────────────────────────────────────────────────── */
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match'); return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters'); return;
        }
        setPasswordLoading(true);
        try {
            const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            if (result.success) {
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                toast.success('Password updated!');
            }
        } catch {
            toast.error('Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    /* ─── Render ────────────────────────────────────────────────────────────── */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden">
            <Sidebar
                activeSection="profile"
                setActiveSection={handleSidebarNavigation}
                isCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                isMobileOpen={isMobileSidebarOpen}
                setIsMobileOpen={setIsMobileSidebarOpen}
            />

            <div className={`transition-all duration-500 ease-in-out min-h-screen flex-1 relative z-10 min-w-0 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <TopNavbar toggleSidebar={() => setIsMobileSidebarOpen(v => !v)} isMobileSidebarOpen={isMobileSidebarOpen} />

                <main className="p-4 sm:p-6 md:p-10 pt-8">
                    <div className="max-w-4xl mx-auto pb-16 animate-fade-in">

                        {/* ── Header card ── */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="relative group">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md text-white font-bold text-2xl uppercase">
                                        {formData.profilePicture
                                            ? <img src={formData.profilePicture} alt={formData.name} className="w-full h-full object-cover" />
                                            : getUserInitials(formData.name || user?.name)
                                        }
                                        {savingPic && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                                                <FaSpinner className="text-white animate-spin" size={22} />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()}
                                        disabled={savingPic}
                                        className="absolute -bottom-2 -right-2 p-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-gray-100 rounded-xl shadow transition-all disabled:opacity-60"
                                        title="Upload photo"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h1 className="text-xl font-bold text-gray-900">{formData.name || getUserDisplayName(user)}</h1>
                                        {user?.googleId && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100">
                                                <HiBadgeCheck className="w-3 h-3" /> Google
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5" /> {user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* Edit / Save buttons */}
                            <div className="flex gap-2 flex-shrink-0">
                                {!isEditing ? (
                                    <button
                                        onClick={() => { setIsEditing(true); setSaveError(''); }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm"
                                    >
                                        <FaEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => { setIsEditing(false); setSaveError(''); fetchProfile(); }}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold border border-gray-200 transition-colors"
                                        >
                                            <FaTimes /> Discard
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FaSave />}
                                            {saving ? 'Saving…' : 'Save Profile'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── Inline save error ── */}
                        {saveError && (
                            <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        {/* ── Form sections — pointer-events disabled when not editing ── */}
                        <div className={!isEditing ? 'pointer-events-none opacity-80' : ''}>

                            {/* Section 1: Personal */}
                            <SectionCard title="Personal Details" icon={FaUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field label="Full Name *">
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="e.g. Harsh Sharma" />
                                    </Field>
                                    <Field label="Phone Number">
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="+91 9876543210" />
                                    </Field>
                                    <div className="md:col-span-2">
                                        <Field label="City / Location">
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="e.g. Mohali, Punjab" />
                                        </Field>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Field label="Professional Summary">
                                            <textarea name="summary" value={formData.summary} onChange={handleChange} disabled={!isEditing} rows={3} className={inputCls} placeholder="Brief career objective or professional bio…" />
                                        </Field>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Section 2: Academic */}
                            <SectionCard title="Academic Details" icon={FaGraduationCap}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field label="Degree Program">
                                        <input type="text" name="degree" value={formData.degree} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="e.g. B.Tech, MCA" />
                                    </Field>
                                    <Field label="Branch / Specialization">
                                        {/* Select dropdown prevents enum mismatch errors */}
                                        <select name="branch" value={formData.branch} onChange={handleChange} disabled={!isEditing} className={inputCls}>
                                            <option value="">-- Select Branch --</option>
                                            {BRANCHES.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Current CGPA">
                                        <input type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="e.g. 8.5" />
                                    </Field>
                                    <Field label="Graduation Year">
                                        <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="e.g. 2025" />
                                    </Field>
                                </div>
                            </SectionCard>

                            {/* Section 3: Links */}
                            <SectionCard title="Social & Portfolio Links" icon={FaGlobe}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field label="LinkedIn Profile">
                                        <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="https://linkedin.com/in/username" />
                                    </Field>
                                    <Field label="GitHub Profile">
                                        <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="https://github.com/username" />
                                    </Field>
                                    <div className="md:col-span-2">
                                        <Field label="Portfolio / Website">
                                            <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} disabled={!isEditing} className={inputCls} placeholder="https://myportfolio.com" />
                                        </Field>
                                    </div>
                                </div>
                            </SectionCard>
                        </div>

                        {/* ── Security (always editable) ── */}
                        <div className="mt-2">
                            <SectionCard title="Change Password" icon={FaLock}>
                                {user?.googleId ? (
                                    <div className="py-6 text-center">
                                        <HiShieldCheck className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                                        <p className="font-semibold text-gray-700 text-sm">Google Managed Account</p>
                                        <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">Password management is handled by Google. Visit your Google Account to update security settings.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                                        <Field label="Current Password">
                                            <input type="password" required value={passwordForm.currentPassword}
                                                onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                                className={inputCls} placeholder="Enter current password" />
                                        </Field>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="New Password">
                                                <input type="password" required value={passwordForm.newPassword}
                                                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                                                    className={inputCls} placeholder="Min 6 characters" />
                                            </Field>
                                            <Field label="Confirm Password">
                                                <input type="password" required value={passwordForm.confirmPassword}
                                                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                                    className={inputCls} placeholder="Repeat new password" />
                                            </Field>
                                        </div>
                                        <button type="submit" disabled={passwordLoading}
                                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60">
                                            {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HiKey className="w-4 h-4" />}
                                            {passwordLoading ? 'Updating…' : 'Update Password'}
                                        </button>
                                    </form>
                                )}
                            </SectionCard>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentProfilePage;
