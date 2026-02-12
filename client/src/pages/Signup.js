import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, getCollegesWithTPOs, searchTPOs } from '../utils/api';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff,
    Building,
    GraduationCap,
    Phone,
    Zap,
    Rocket,
    ShieldCheck,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        role: 'student', phone: '',
        collegeName: '', branch: '', year: '', rollNumber: '',
        companyName: '', designation: '', companySize: '',
        tpoId: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [colleges, setColleges] = useState([]);
    const [tpoList, setTpoList] = useState([]);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const response = await getCollegesWithTPOs();
                if (response.data) setColleges(response.data.colleges || []);
            } catch (err) { console.error('Error fetching colleges:', err); }
        };
        fetchColleges();
    }, []);

    useEffect(() => {
        if (formData.collegeName && formData.role === 'student') {
            const fetchTPOs = async () => {
                try {
                    const response = await searchTPOs(formData.collegeName);
                    if (response.data) setTpoList(response.data.tpos || []);
                } catch (err) { console.error('Error fetching TPOs:', err); }
            };
            fetchTPOs();
        }
    }, [formData.collegeName, formData.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name required';
        if (!formData.email) newErrors.email = 'Email required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format invalid';
        if (!formData.password) newErrors.password = 'Security key required';
        else if (formData.password.length < 6) newErrors.password = 'Force failure: Min 6 chars';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Keys mismatch';
        if (!formData.phone) newErrors.phone = 'Communication line required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await registerUser(formData);
            if (response.data.success) {
                toast.success('Registration sequence initialized.');
                navigate('/verify-otp', { state: { userId: response.data.userId, email: formData.email } });
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Initialization error';
            toast.error(message);
            setErrors({ general: message });
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { value: 'student', label: 'Talent', icon: GraduationCap, desc: 'Seeking high-impact placements' },
        { value: 'company', label: 'Partner', icon: Building, desc: 'Acquiring world-class talent' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden relative">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-blob pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative z-10 animate-fade-in">

                {/* Left Panel: Stepper Feedback */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-white/5 to-white/[0.02] border-r border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12 pointer-events-none text-white">
                        <Rocket size={300} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/10 group-hover:scale-110 transition-transform duration-500">
                                <Zap className="text-slate-900 w-6 h-6 fill-slate-900" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">ELEVATE</span>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Protocol Initiation</p>
                                <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">
                                    Join the Elite <br /> Recruitment Core.
                                </h1>
                            </div>

                            {/* Visual Steps */}
                            <div className="space-y-6">
                                {[
                                    { s: 1, label: 'Identity Protocol', active: step >= 1 },
                                    { s: 2, label: 'Professional Blueprint', active: step >= 2 },
                                    { s: 3, label: 'Neural Sync', active: false }
                                ].map((s, idx) => (
                                    <div key={idx} className={`flex items-center gap-6 transition-all duration-700 ${s.active ? 'opacity-100 translate-x-4' : 'opacity-30'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border-2 ${s.active ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' : 'border-white/20 text-white'}`}>
                                            {idx === 0 && step > 1 ? <Check size={16} /> : s.s}
                                        </div>
                                        <span className={`font-bold text-sm uppercase tracking-widest ${s.active ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                            By initializing this profile, you agree to <br /> our algorithmic recruitment protocols.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Signup Form */}
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto max-h-screen scroll-smooth custom-scrollbar">
                    <div className="max-w-md mx-auto w-full space-y-8 py-4">
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-3xl font-black text-white tracking-tighter">
                                {step === 1 ? 'New Profile Identity' : 'Structural Mapping'}
                            </h2>
                            <p className="text-slate-400 font-medium">
                                Already registered?{' '}
                                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors decoration-indigo-400/30 hover:decoration-indigo-300 text-sm">
                                    Secure Log In
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" key={step}>
                            {step === 1 ? (
                                <>
                                    {/* Role Configuration */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Strategic Designation</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {roles.map((role) => {
                                                const Icon = role.icon;
                                                const isActive = formData.role === role.value;
                                                return (
                                                    <button key={role.value} type="button" onClick={() => handleChange({ target: { name: 'role', value: role.value } })}
                                                        className={`p-5 rounded-3xl border-2 text-left transition-all duration-500 group relative overflow-hidden ${isActive ? 'border-indigo-500 bg-indigo-500/10 shadow-2xl shadow-indigo-500/10' : 'border-white/5 hover:border-white/10'}`}
                                                    >
                                                        <Icon className={`h-5 w-5 mb-3 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                                        <p className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-400'}`}>{role.label}</p>
                                                        {isActive && <div className="absolute top-3 right-3 w-4 h-4 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg"><Check size={10} className="text-white" /></div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Basic Data Grid */}
                                    <div className="space-y-4">
                                        <div className="group space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Signature (Name)</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400" />
                                                <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner" />
                                            </div>
                                        </div>

                                        <div className="group space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Identifier (Email)</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400" />
                                                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@network.system"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner" />
                                            </div>
                                        </div>

                                        <div className="group space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Comms Protocol (Phone)</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400" />
                                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 90000 00000"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner" />
                                            </div>
                                        </div>

                                        {/* Security Keys */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 text-center">Security Key</label>
                                                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Min 6"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 text-center">Repeat Key</label>
                                                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-type"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="button" onClick={handleNextStep}
                                        className="w-full bg-white text-slate-900 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-50 transition-all duration-500 transform hover:-translate-y-1 flex justify-center items-center group"
                                    >
                                        Validate Step 01 <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Structural Config: Student */}
                                    {formData.role === 'student' && (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Sector (College)</label>
                                                <select name="collegeName" value={formData.collegeName} onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 appearance-none cursor-pointer">
                                                    <option className="bg-slate-900" value="">Select Institutional Hub</option>
                                                    {colleges.map((c, i) => <option key={i} className="bg-slate-900" value={c}>{c}</option>)}
                                                </select>
                                            </div>

                                            {tpoList.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Primary Controller (TPO)</label>
                                                    <select name="tpoId" value={formData.tpoId} onChange={handleChange}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 appearance-none cursor-pointer">
                                                        <option className="bg-slate-900" value="">Select Assigned Controller</option>
                                                        {tpoList.map((t) => <option key={t._id} className="bg-slate-900" value={t._id}>{t.name}</option>)}
                                                    </select>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Vertical (Branch)</label>
                                                    <input name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. CSE"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 placeholder:text-slate-600" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Orbit (Year)</label>
                                                    <select name="year" value={formData.year} onChange={handleChange}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 appearance-none cursor-pointer">
                                                        <option className="bg-slate-900" value="">Select Orbit</option>
                                                        {[1, 2, 3, 4].map(y => <option key={y} className="bg-slate-900" value={y}>Orbit 0{y}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Unit ID (Roll No)</label>
                                                <input name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Identifier code"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 placeholder:text-slate-600" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Companies */}
                                    {formData.role === 'company' && (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Enterprise Core</label>
                                                <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Legal Enterprise Name"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Access Designation</label>
                                                <input name="designation" value={formData.designation} onChange={handleChange} placeholder="HR Lead / Recruiter"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setStep(1)}
                                            className="px-8 bg-white/5 border border-white/10 text-white rounded-[2rem] font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                                            Roll Back
                                        </button>
                                        <button type="submit" disabled={loading}
                                            className="flex-1 flex justify-center items-center py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-500/40 hover:bg-indigo-500 hover:shadow-indigo-500/60 transition-all transform hover:-translate-y-1 group disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Deploy Profile <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
