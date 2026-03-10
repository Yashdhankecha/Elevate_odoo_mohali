import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GraduationCap, Building2, Presentation, CheckCircle2, Eye, EyeOff, Mail, Lock, ArrowRight, Phone, User, School, Loader2 } from 'lucide-react';
import { registerUser, searchTPOs } from '../utils/api';

const InputWrapper = ({ label, icon: Icon, children, error }) => (
    <div className="space-y-1.5">
        <label className="form-label px-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                <Icon className="h-5 w-5" />
            </div>
            {children}
        </div>
        {error && <p className="text-xs text-rose-500 font-medium px-1">{error}</p>}
    </div>
);

const Signup = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [collegeSuggestions, setCollegeSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchingColleges, setIsSearchingColleges] = useState(false);
    const [selectedTPO, setSelectedTPO] = useState(null);
    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '',
        name: '', rollNumber: '', branch: '', graduationYear: '', collegeName: '',
        companyName: '', contactNumber: '', instituteName: ''
    });

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setFormData({
            email: '', password: '', confirmPassword: '',
            name: '', rollNumber: '', branch: '', graduationYear: '', collegeName: '',
            companyName: '', contactNumber: '', instituteName: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'collegeName' && selectedRole === 'student') searchColleges(value);
    };

    const searchColleges = async (collegeName) => {
        if (!collegeName || collegeName.trim().length < 2) {
            setCollegeSuggestions([]);
            setShowSuggestions(false);
            setSelectedTPO(null);
            return;
        }
        setIsSearchingColleges(true);
        try {
            const response = await searchTPOs(collegeName);
            if (response.success) {
                setCollegeSuggestions(response.tpos);
                setShowSuggestions(response.tpos.length > 0);
            }
        } catch (error) {
            console.error('Error searching colleges:', error);
        } finally {
            setIsSearchingColleges(false);
        }
    };

    const selectCollege = (college) => {
        setFormData(prev => ({ ...prev, collegeName: college.instituteName }));
        setSelectedTPO(college);
        setShowSuggestions(false);
    };

    const validateForm = () => {
        if (!selectedRole) { toast.error('Please select a role'); return false; }
        if (!formData.email || !formData.password || !formData.confirmPassword) { toast.error('Required fields missing'); return false; }
        if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return false; }
        if (formData.password.length < 6) { toast.error('Password too short (min 6)'); return false; }

        if (selectedRole === 'student') {
            if (!formData.name || !formData.rollNumber || !formData.branch || !formData.graduationYear || !formData.collegeName) { toast.error('Fill student fields'); return false; }
            if (!selectedTPO) { toast.error('Select verified college'); return false; }
        } else if (selectedRole === 'company') {
            if (!formData.companyName || !formData.contactNumber) { toast.error('Fill company fields'); return false; }
        } else if (selectedRole === 'tpo') {
            if (!formData.name || !formData.instituteName || !formData.contactNumber) { toast.error('Fill TPO fields'); return false; }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const response = await registerUser({ role: selectedRole, ...formData });
            if (response.success) {
                toast.success(response.message);
                navigate('/verify-otp', { state: { userId: response.userId, email: formData.email, role: selectedRole } });
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-mesh relative flex items-center justify-center p-4 overflow-hidden py-12">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

            <div className="max-w-xl w-full relative z-10">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-indigo-100 mb-6 hover-lift">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">E</div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Create <span className="text-gradient">Account</span></h1>
                    <p className="text-slate-500 font-medium px-4">Join the ultimate placement tracking intelligence platform</p>
                </div>

                <div className="glass-card rounded-[2.5rem] p-8 md:p-10 animate-slide-up">
                    <div className="mb-10">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Choose your destination</h3>
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {[
                                { id: 'student', icon: GraduationCap, label: 'Student' },
                                { id: 'company', icon: Building2, label: 'Company' },
                                { id: 'tpo', icon: Presentation, label: 'TPO' }
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => handleRoleSelect(role.id)}
                                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${selectedRole === role.id
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                                        : 'border-slate-100 bg-white/50 text-slate-500 hover:border-indigo-200 hover:bg-white'
                                        }`}
                                >
                                    <role.icon className={`w-8 h-8 mb-2 transition-transform ${selectedRole === role.id ? 'scale-110' : ''}`} />
                                    <span className="text-xs md:text-sm font-bold">{role.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedRole ? (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputWrapper label="Email Address" icon={Mail}>
                                    <input name="email" type="email" required className="input-field pl-12" placeholder="name@email.com" value={formData.email} onChange={handleInputChange} />
                                </InputWrapper>

                                <InputWrapper label="Full Name" icon={User}>
                                    <input name="name" type="text" required className="input-field pl-12" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                                </InputWrapper>

                                <InputWrapper label="Password" icon={Lock}>
                                    <input name="password" type={showPassword ? 'text' : 'password'} required className="input-field pl-12 pr-12" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                                    <button type="button" className="absolute inset-y-0 right-0 pr-4 text-slate-400 hover:text-indigo-600" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </InputWrapper>

                                <InputWrapper label="Confirm Password" icon={Lock}>
                                    <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required className="input-field pl-12 pr-12" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} />
                                    <button type="button" className="absolute inset-y-0 right-0 pr-4 text-slate-400 hover:text-indigo-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </InputWrapper>

                                {selectedRole === 'student' && (
                                    <>
                                        <InputWrapper label="Roll Number" icon={User}>
                                            <input name="rollNumber" type="text" required className="input-field pl-12" placeholder="BT123456" value={formData.rollNumber} onChange={handleInputChange} />
                                        </InputWrapper>
                                        <InputWrapper label="Branch" icon={GraduationCap}>
                                            <input name="branch" type="text" required className="input-field pl-12" placeholder="CSE" value={formData.branch} onChange={handleInputChange} />
                                        </InputWrapper>
                                        <InputWrapper label="Graduation Year" icon={School}>
                                            <input name="graduationYear" type="number" required className="input-field pl-12" placeholder="2025" value={formData.graduationYear} onChange={handleInputChange} />
                                        </InputWrapper>
                                        <div className="md:col-span-2 relative">
                                            <InputWrapper label="College Name" icon={Building2}>
                                                <input
                                                    name="collegeName" type="text" required className="input-field pl-12" placeholder="Search major colleges..." value={formData.collegeName}
                                                    onChange={handleInputChange} onFocus={() => collegeSuggestions.length > 0 && setShowSuggestions(true)}
                                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                                />
                                                {isSearchingColleges && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Loader2 className="animate-spin h-4 w-4 text-indigo-500" /></div>}
                                                {selectedTPO && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 h-5 w-5" />}
                                            </InputWrapper>
                                            {showSuggestions && collegeSuggestions.length > 0 && (
                                                <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">
                                                    {collegeSuggestions.map((c, i) => (
                                                        <div key={i} onClick={() => selectCollege(c)} className="p-4 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                                                            <p className="font-bold text-slate-800">{c.instituteName}</p>
                                                            <p className="text-xs text-slate-500">TPO: {c.tpoName} • {c.tpoEmail}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {selectedTPO && (
                                                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3 animate-fade-in">
                                                    <CheckCircle2 className="text-emerald-500 mt-1 h-4 w-4" />
                                                    <div>
                                                        <p className="text-xs font-bold text-emerald-700">Verified Integration</p>
                                                        <p className="text-[10px] text-emerald-600">Connected to TPO {selectedTPO.tpoName}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {selectedRole === 'company' && (
                                    <>
                                        <InputWrapper label="Company Name" icon={Building2}>
                                            <input name="companyName" type="text" required className="input-field pl-12" placeholder="TechCorp Inc." value={formData.companyName} onChange={handleInputChange} />
                                        </InputWrapper>
                                        <InputWrapper label="Contact Number" icon={Phone}>
                                            <input name="contactNumber" type="tel" required className="input-field pl-12" placeholder="+91 XXXX XXXX" value={formData.contactNumber} onChange={handleInputChange} />
                                        </InputWrapper>
                                    </>
                                )}

                                {selectedRole === 'tpo' && (
                                    <>
                                        <InputWrapper label="Institute Name" icon={School}>
                                            <input name="instituteName" type="text" required className="input-field pl-12" placeholder="University Engineering College" value={formData.instituteName} onChange={handleInputChange} />
                                        </InputWrapper>
                                        <InputWrapper label="Contact Number" icon={Phone}>
                                            <input name="contactNumber" type="tel" required className="input-field pl-12" placeholder="+91 XXXX XXXX" value={formData.contactNumber} onChange={handleInputChange} />
                                        </InputWrapper>
                                    </>
                                )}
                            </div>

                            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 group">
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Create Account <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></>}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <p className="text-slate-400 font-medium">Please select your role to continue</p>
                        </div>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-200/50 text-center">
                        <p className="text-slate-500 font-medium">Already part of Elevate? <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
