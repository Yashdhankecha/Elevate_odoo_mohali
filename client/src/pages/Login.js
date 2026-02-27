import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldAlert, Clock, XCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [approvalState, setApprovalState] = useState(null); // null | 'pending' | 'rejected'

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name] || errors.general) {
            setErrors(prev => ({ ...prev, [name]: '', general: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setApprovalState(null);
        try {
            const result = await login(formData.email, formData.password);
            if (result.requiresVerification) {
                navigate('/verify-otp', { state: { userId: result.userId, email: formData.email } });
            } else if (result.requiresApproval) {
                setApprovalState('pending');
            } else if (result.registrationRejected) {
                setApprovalState('rejected');
            } else if (!result.success) {
                setErrors({ general: result.message || 'Login failed. Please check your credentials.' });
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setApprovalState(null);
        setErrors({});
        setFormData({ email: '', password: '' });
    };

    // ─── Approval Pending / Rejected UI ─────────────────────────────
    if (approvalState === 'pending' || approvalState === 'rejected') {
        const isPending = approvalState === 'pending';
        return (
            <div className="min-h-screen bg-gradient-mesh relative flex items-center justify-center p-4 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

                <div className="max-w-md w-full relative z-10 animate-slide-up">
                    <div className="glass-card rounded-[2rem] p-8 md:p-10">
                        {/* Icon */}
                        <div className="text-center mb-8">
                            <div style={{
                                width: '88px',
                                height: '88px',
                                margin: '0 auto 24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                background: isPending
                                    ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
                                    : 'linear-gradient(135deg, #FEE2E2, #FECACA)',
                                boxShadow: isPending
                                    ? '0 8px 32px rgba(245, 158, 11, 0.2)'
                                    : '0 8px 32px rgba(239, 68, 68, 0.2)',
                            }}>
                                {isPending ? (
                                    <Clock style={{ width: '40px', height: '40px', color: '#D97706' }} />
                                ) : (
                                    <XCircle style={{ width: '40px', height: '40px', color: '#DC2626' }} />
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: isPending
                                        ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                                        : 'linear-gradient(135deg, #EF4444, #DC2626)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                }}>
                                    <ShieldAlert style={{ width: '18px', height: '18px', color: 'white' }} />
                                </div>
                            </div>

                            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
                                {isPending ? (
                                    <>Account <span className="text-gradient">Not Verified</span></>
                                ) : (
                                    <>Account <span style={{ color: '#DC2626' }}>Rejected</span></>
                                )}
                            </h1>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {isPending
                                    ? 'Your TPO account has not been verified by the Super Admin yet. Please wait for approval before logging in.'
                                    : 'Your registration has been rejected. Please contact the administration for more information.'}
                            </p>
                        </div>

                        {/* Info Card */}
                        <div style={{
                            background: isPending
                                ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)'
                                : 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
                            borderRadius: '20px',
                            padding: '24px',
                            marginBottom: '24px',
                            border: isPending
                                ? '1px solid #FDE68A'
                                : '1px solid #FECACA',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: isPending ? '#FEF3C7' : '#FEE2E2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    border: isPending ? '1px solid #FCD34D' : '1px solid #FCA5A5',
                                }}>
                                    <Mail style={{
                                        width: '20px',
                                        height: '20px',
                                        color: isPending ? '#B45309' : '#B91C1C'
                                    }} />
                                </div>
                                <div>
                                    <p style={{
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: isPending ? '#92400E' : '#991B1B',
                                        marginBottom: '4px',
                                    }}>
                                        {isPending ? 'Pending Super Admin Approval' : 'Registration Rejected'}
                                    </p>
                                    <p style={{
                                        fontSize: '13px',
                                        color: isPending ? '#A16207' : '#B91C1C',
                                        lineHeight: '1.6',
                                    }}>
                                        {isPending
                                            ? `Your account (${formData.email}) is currently under review. You will be able to log in once the Super Admin approves your TPO registration.`
                                            : `The account (${formData.email}) was not approved. Please reach out to the Super Admin for clarification.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Steps / What to Expect */}
                        {isPending && (
                            <div style={{
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: '20px',
                                padding: '24px',
                                marginBottom: '24px',
                                border: '1px solid rgba(255,255,255,0.6)',
                                backdropFilter: 'blur(8px)',
                            }}>
                                <p style={{
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: '#334155',
                                    marginBottom: '16px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>What happens next?</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { step: '1', text: 'Super Admin reviews your TPO registration' },
                                        { step: '2', text: 'Your account gets verified and activated' },
                                        { step: '3', text: 'You can log in and access the TPO dashboard' },
                                    ].map((item) => (
                                        <div key={item.step} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px',
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '13px',
                                                fontWeight: '800',
                                                flexShrink: 0,
                                            }}>
                                                {item.step}
                                            </div>
                                            <p style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#475569',
                                            }}>{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back to Login Button */}
                        <button
                            onClick={handleBackToLogin}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                        >
                            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                            Back to Login
                        </button>

                        <div className="mt-6 text-center">
                            <p style={{
                                fontSize: '12px',
                                color: '#94A3B8',
                                fontStyle: 'italic',
                                lineHeight: '1.6',
                            }}>
                                {isPending
                                    ? 'Verification usually takes 24–48 hours. Please be patient.'
                                    : 'If you believe this is a mistake, please contact the Super Admin.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Normal Login Form ──────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-mesh relative flex items-center justify-center p-4 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-indigo-100 mb-6 hover-lift">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                            E
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                        Welcome <span className="text-gradient">Back</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Ready to continue your journey?</p>
                </div>

                {/* Login Card */}
                <div className="glass-card rounded-[2rem] p-8 md:p-10 animate-slide-up">
                    {errors.general && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-fade-in">
                            <p className="text-sm text-rose-600 font-semibold">{errors.general}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label className="form-label px-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className={`input-field pl-12 ${errors.email ? 'border-rose-300 ring-rose-200 ring-2' : ''}`}
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.email && <p className="mt-2 text-xs text-rose-500 font-medium px-1">{errors.email}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <label className="text-sm font-semibold text-slate-700">Password</label>
                                    <Link to="/forgot-password" title="Forgot Password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className={`input-field pl-12 pr-12 ${errors.password ? 'border-rose-300 ring-rose-200 ring-2' : ''}`}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-2 text-xs text-rose-500 font-medium px-1">{errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-200/50 text-center">
                        <p className="text-slate-500 font-medium">
                            New here?{' '}
                            <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;