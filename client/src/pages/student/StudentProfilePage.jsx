import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../services/studentApi';
import { getUserDisplayName, getUserInitials } from '../../utils/helpers';
import { HiShieldCheck, HiKey, HiBadgeCheck } from 'react-icons/hi';
import {
    Loader2, ShieldCheck, Camera, Mail, Calendar, Settings,
    User, BookOpen, Link as LinkIcon
} from 'lucide-react';
import {
    FaUser, FaGraduationCap, FaGlobe, FaEdit, FaSave, FaTimes, FaSpinner, FaLock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

const SectionWrapper = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-md">
        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const StudentProfilePage = () => {
    const { user, changePassword, verifyAuth } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [savingLogo, setSavingLogo] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const logoInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        summary: '',
        degree: '',
        branch: '',
        cgpa: '',
        graduationYear: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        profilePicture: ''
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await studentApi.getProfile();
            if (data) {
                setFormData({
                    name: data.name || '',
                    phone: data.personalInfo?.phone || data.phoneNumber || '',
                    address: data.personalInfo?.address?.city || '',
                    summary: data.summary || '',
                    degree: data.education?.degree || data.degree || '',
                    branch: data.education?.specialization || data.branch || '',
                    cgpa: data.cgpa || '',
                    graduationYear: data.graduationYear || '',
                    linkedinUrl: data.links?.linkedin || '',
                    githubUrl: data.links?.github || '',
                    portfolioUrl: data.links?.portfolio || '',
                    profilePicture: data.profilePicture || user?.profilePicture || ''
                });
            }
        } catch (error) {
            toast.error('Failed to load profile details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const toggleSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const handleSidebarNavigation = (section) => {
        if (section === 'profile') return;
        navigate(`/student-dashboard?section=${section}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            const loadingToast = toast.loading('Saving profile...');

            const payload = {
                name: formData.name,
                phoneNumber: formData.phone,
                personalInfo: { phone: formData.phone, address: { city: formData.address } },
                summary: formData.summary,
                degree: formData.degree,
                branch: formData.branch,
                cgpa: formData.cgpa,
                graduationYear: formData.graduationYear,
                education: { degree: formData.degree, specialization: formData.branch },
                links: {
                    linkedin: formData.linkedinUrl,
                    github: formData.githubUrl,
                    portfolio: formData.portfolioUrl
                }
            };

            await studentApi.updateProfile(payload);
            setIsEditing(false);
            toast.success('Profile saved successfully', { id: loadingToast });
            verifyAuth(); // Refresh user context
        } catch (error) {
            toast.error('Failed to save profile');
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }

        setSavingLogo(true);
        try {
            const uploadedUrl = await studentApi.uploadProfilePicture(file);
            setFormData(prev => ({ ...prev, profilePicture: uploadedUrl }));
            toast.success('Profile picture updated successfully!');
            fetchProfile();
            verifyAuth();
        } catch (error) {
            toast.error('Failed to upload picture. Please try again.');
        } finally {
            setSavingLogo(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords mismatch');
            return;
        }
        setPasswordLoading(true);
        try {
            const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            if (result.success) {
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                toast.success('Password updated successfully!');
            }
        } catch (error) {
            toast.error('Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

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

            <div className={`
            transition-all duration-500 ease-in-out min-h-screen flex-1 relative z-10 min-w-0
            ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
            `}>
                <TopNavbar toggleSidebar={toggleSidebar} isMobileSidebarOpen={isMobileSidebarOpen} />

                <main className="p-4 sm:p-6 md:p-10 pt-8">
                    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                {/* Profile Picture with Upload Button */}
                                <div className="relative group">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md text-white font-bold text-2xl uppercase">
                                        {formData.profilePicture ? (
                                            <img
                                                src={formData.profilePicture}
                                                alt={formData.name || user?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            getUserInitials(formData.name || user?.name)
                                        )}
                                        {savingLogo && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                                                <FaSpinner className="text-white animate-spin" size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()}
                                        disabled={savingLogo}
                                        className="absolute -bottom-2 -right-2 p-2.5 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-gray-100 rounded-xl shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-60 z-10"
                                        title="Upload profile picture"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-gray-800">{formData.name || getUserDisplayName(user)}</h1>
                                        {user?.googleId && (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100">
                                                <HiBadgeCheck className="w-3 h-3" />
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5" />
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                        Edit Details
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium border border-gray-200"
                                        >
                                            <FaTimes className="w-4 h-4" />
                                            Discard
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
                                        >
                                            <FaSave className="w-4 h-4" />
                                            Save Profile
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={`space-y-6 ${!isEditing ? 'opacity-90 pointer-events-none' : ''}`}>
                            {/* Section 1: Basic Identity */}
                            <SectionWrapper title="Personal Identity" icon={FaUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="e.g. John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="+91 9876543210" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / Current Address</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="e.g. Bangalore, Karnataka" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                                        <textarea name="summary" value={formData.summary} onChange={handleChange} rows="3" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="A brief summary about your career objectives..."></textarea>
                                    </div>
                                </div>
                            </SectionWrapper>

                            {/* Section 2: Academics */}
                            <SectionWrapper title="Academic Details" icon={FaGraduationCap}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree Program</label>
                                        <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="e.g. B.Tech" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization / Branch</label>
                                        <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="e.g. Computer Science" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current CGPA</label>
                                        <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="e.g. 8.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                                        <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="e.g. 2025" />
                                    </div>
                                </div>
                            </SectionWrapper>

                            {/* Section 3: Social & Showcase */}
                            <SectionWrapper title="Social Links & Endorsements" icon={FaGlobe}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                                        <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="https://linkedin.com/in/username" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
                                        <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="https://github.com/username" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Portfolio / Website</label>
                                        <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-800" placeholder="https://myportfolio.com" />
                                    </div>
                                </div>
                            </SectionWrapper>
                        </div>

                        {/* Security Section (Always Active/Editable) */}
                        <div className="mt-8">
                            <SectionWrapper title="Access Security" icon={FaLock}>
                                {user?.googleId ? (
                                    <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <HiShieldCheck className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <h4 className="text-slate-900 font-bold mb-2 text-sm sm:text-base">Google Managed Security</h4>
                                        <p className="text-slate-500 text-xs sm:text-sm max-w-xs mx-auto">Password management is handled by Google. To change your security settings, please visit your Google Account.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePasswordSubmit} className="space-y-5 sm:space-y-6 max-w-2xl">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest px-1 mb-1">Current Password</label>
                                                <input
                                                    type="password" name="currentPassword" required
                                                    value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                                                    placeholder="Enter existing password"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest px-1 mb-1">New Password</label>
                                                    <input
                                                        type="password" name="newPassword" required
                                                        value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                                                        placeholder="At least 6 chars"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-widest px-1 mb-1">Confirm Password</label>
                                                    <input
                                                        type="password" name="confirmPassword" required
                                                        value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                                                        placeholder="Verify new password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={passwordLoading} className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50">
                                            {passwordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><HiKey className="w-5 h-5" /> Update Password</>}
                                        </button>
                                    </form>
                                )}
                            </SectionWrapper>
                        </div>

                    </div>
                </main >
            </div >
        </div >
    );
};

export default StudentProfilePage;
