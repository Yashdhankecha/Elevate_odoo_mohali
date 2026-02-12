import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff,
    ShieldCheck,
    Zap,
    Globe,
    Sparkles
} from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Identifier required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid syntax';
        if (!formData.password) newErrors.password = 'Security key required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await login(formData.email, formData.password);
        } catch (error) {
            setErrors({ general: error.message || 'Authentication sequence failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden relative">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-blob pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full animate-blob animation-delay-4000 pointer-events-none"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative z-10 animate-fade-in">

                {/* Left Panel: Branding & Impact */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-white/5 to-white/[0.02] border-r border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12 pointer-events-none">
                        <Sparkles size={300} className="text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/10 group-hover:scale-110 transition-transform duration-500">
                                <Zap className="text-slate-900 w-6 h-6 fill-slate-900" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">ELEVATE</span>
                        </div>

                        <div className="space-y-8 max-w-md">
                            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
                                Your Career <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Accelerated.</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                Access the global talent infrastructure. Join thousands of elites securing their future on the most advanced recruitment network.
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                                    <p className="text-3xl font-black text-white">500+</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Global Partners</p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                                    <p className="text-3xl font-black text-white">98%</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Success Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-t border-white/5 pt-8">
                        <span>v4.2.0 Stable Build</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span>Secure Session Active</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Authentication Form */}
                <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
                    <div className="lg:hidden flex justify-center mb-10">
                        <div className="w-14 h-14 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-white/20">
                            <Zap className="text-slate-900 w-7 h-7 fill-slate-900" />
                        </div>
                    </div>

                    <div className="max-w-sm mx-auto w-full space-y-10">
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-4xl font-black text-white tracking-tighter">Authentication</h2>
                            <p className="text-slate-400 font-medium">
                                New to the protocol?{' '}
                                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors decoration-indigo-400/30 hover:decoration-indigo-300 text-sm">
                                    Initialize Profile
                                </Link>
                            </p>
                        </div>

                        {errors.general && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 animate-shake">
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">{errors.general}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Network Identifier</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        name="email" type="email" required
                                        value={formData.email} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 focus:border-indigo-500/50 transition-all duration-300 placeholder:text-slate-600 shadow-inner"
                                        placeholder="user@network.system"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between px-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Key</label>
                                    <Link to="/forgot-password" size={10} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Recovery?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        name="password" type={showPassword ? 'text' : 'password'} required
                                        value={formData.password} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:bg-white/10 focus:border-indigo-500/50 transition-all duration-300 placeholder:text-slate-600 shadow-inner"
                                        placeholder="••••••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-white text-slate-900 py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-white/5 hover:bg-indigo-50 hover:shadow-indigo-500/20 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>Authorize Session <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="pt-6 flex items-center justify-center gap-6">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                                <Globe size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                                <ShieldCheck size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
