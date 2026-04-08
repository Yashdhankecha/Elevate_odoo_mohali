import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../services/studentApi';
import { getUserDisplayName, getUserInitials } from '../../utils/helpers';
import { HiShieldCheck, HiKey, HiBadgeCheck } from 'react-icons/hi';
import { Loader2, Camera, Mail, Menu } from 'lucide-react';
import { FaUser, FaGraduationCap, FaGlobe, FaEdit, FaSave, FaTimes, FaSpinner, FaLock, FaExclamationCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Sidebar from './components/Sidebar';

const BRANCHES = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'AI&DS', 'Other'];

const Field = ({ label, children }) => (
    <div className="w-full">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full px-4 py-3 border border-slate-200 rounded text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all disabled:opacity-60 disabled:bg-slate-50";

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded border border-slate-200 overflow-hidden mb-6 shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-white border border-slate-200 text-slate-800 rounded shadow-sm">
                <Icon className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h2>
        </div>
        <div className="p-4 sm:p-8">{children}</div>
    </div>
);

const StudentProfilePage = () => {
    const { user, changePassword, verifyAuth } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingPic, setSavingPic] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveError, setSaveError] = useState('');

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (saveError) setSaveError('');
    };

    const handleSaveProfile = async () => {
        setSaveError('');
        if (!formData.name.trim()) { setSaveError('Name is required.'); return; }

        try {
            setSaving(true);
            const loadingToast = toast.loading('Saving profile…');
            const payload = {
                name: formData.name,
                phone: formData.phone,
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
                address: formData.address
            };

            await studentApi.updateProfile(payload);
            setIsEditing(false);
            toast.success('Profile saved!', { id: loadingToast });
            verifyAuth();
            fetchProfile();
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to save profile.';
            setSaveError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
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

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
            <Sidebar
                activeSection="profile"
                setActiveSection={(s) => navigate(`/student-dashboard/${s}`)}
                isCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                isMobileOpen={isMobileSidebarOpen}
                setIsMobileOpen={setIsMobileSidebarOpen}
            />

            <div className={`transition-all duration-500 ease-in-out min-h-screen flex-1 relative z-10 min-w-0 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 text-slate-600">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-black text-slate-900 tracking-tighter">PROFILE</h1>
                    <div className="w-10" />
                </header>

                <main className="p-4 sm:p-8 lg:p-12 overflow-x-hidden">
                    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 bg-white p-6 sm:p-10 rounded border border-slate-200 shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                            
                            <div className="relative z-10 flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-slate-900 rounded flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-xl text-white font-black text-3xl">
                                        {formData.profilePicture
                                            ? <img src={formData.profilePicture} alt={formData.name} className="w-full h-full object-cover" />
                                            : getUserInitials(formData.name || user?.name)
                                        }
                                        {savingPic && <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center"><Loader2 className="text-white animate-spin" size={24} /></div>}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 p-2 bg-white text-slate-900 border border-slate-200 rounded shadow-lg hover:bg-slate-50 transition-all"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1 capitalize">{formData.name || getUserDisplayName(user)}</h1>
                                    <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5" /> {user?.email}
                                    </p>
                                    <div className="mt-3 flex gap-2">
                                         <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded">Student ID: {user?._id?.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none bg-slate-900 text-white px-8 py-3 rounded text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2">
                                        <FaEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => { setIsEditing(false); fetchProfile(); }} className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveProfile} disabled={saving} className="flex-1 sm:flex-none bg-slate-900 text-white px-8 py-3 rounded text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FaSave />} Save Protocol
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {saveError && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded flex items-center gap-3">
                                <FaExclamationCircle /> {saveError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            <SectionCard title="Personal Dossier" icon={FaUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Full Name"><input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field>
                                    <Field label="Phone Protocol"><input name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field>
                                    <div className="md:col-span-2"><Field label="Operations Base (Address)"><input name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field></div>
                                    <div className="md:col-span-2"><Field label="Professional Summary"><textarea name="summary" value={formData.summary} onChange={handleChange} disabled={!isEditing} rows={4} className={`${inputCls} resize-none`} /></Field></div>
                                </div>
                            </SectionCard>

                            <SectionCard title="Academic Matrix" icon={FaGraduationCap}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Academic Degree"><input name="degree" value={formData.degree} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field>
                                    <Field label="Departmental Branch">
                                        <select name="branch" value={formData.branch} onChange={handleChange} disabled={!isEditing} className={inputCls}>
                                            <option value="">Select Branch</option>
                                            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Current CGPA"><input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field>
                                    <Field label="Graduation Cycle"><input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field>
                                </div>
                            </SectionCard>

                            <SectionCard title="External Nexus" icon={FaGlobe}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="LinkedIn Hub"><input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field>
                                    <Field label="GitHub Vault"><input name="githubUrl" value={formData.githubUrl} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field>
                                    <div className="md:col-span-2"><Field label="Personal Terminal (Portfolio)"><input name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} disabled={!isEditing} className={inputCls} /></Field></div>
                                </div>
                            </SectionCard>

                             <SectionCard title="Security Protocol" icon={FaLock}>
                                {user?.googleId ? (
                                    <div className="py-2 text-slate-500 text-sm font-medium">Managed via Google Identity.</div>
                                ) : (
                                    <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Current Key"><input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} className={inputCls} /></Field>
                                        <div className="hidden sm:block" />
                                        <Field label="New Key"><input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} className={inputCls} /></Field>
                                        <Field label="Re-enter Key"><input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} className={inputCls} /></Field>
                                        <button className="sm:col-span-2 mt-2 bg-slate-900 text-white py-3 rounded text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                            {passwordLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <HiKey />} Update Security Protocol
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
