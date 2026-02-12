import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resendVerification } from '../utils/api';
import { ArrowLeft, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOTP } = useAuth();
    const { userId, email } = location.state || {};

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!userId) navigate('/signup', { replace: true });
        inputRefs.current[0]?.focus();
    }, [userId, navigate]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pasted.split('').forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) { setError('Please enter the complete 6-digit code'); return; }

        setLoading(true);
        try {
            await verifyOTP(userId, code);
            setVerified(true);
            toast.success('Email verified successfully!');
            setTimeout(() => navigate('/login', { replace: true }), 2000);
        } catch (error) {
            setError(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await resendVerification(email);
            toast.success('OTP resent to your email');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            toast.error('Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    if (verified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
                    <p className="text-slate-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden bg-slate-900 p-6 text-white pb-32">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/signup" className="inline-flex items-center text-slate-300 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                    </Link>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-xl font-bold text-white">E</span>
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-2 tracking-tight">Verify your email</h1>
                <p className="text-sm text-slate-300">We sent a code to {email}</p>
            </div>

            {/* Left Branding (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between text-white p-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>
                <div className="relative z-10 w-full">
                    <Link to="/signup" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign Up
                    </Link>
                </div>
                <div className="relative z-10 max-w-lg mb-auto mt-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 shadow-indigo-500/20">
                        <span className="text-3xl font-bold text-white">E</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Verify your email</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        We sent a 6-digit verification code to <span className="text-white font-semibold">{email}</span>. Enter it below to activate your account.
                    </p>
                </div>
                <div className="relative z-10 w-full pt-8 border-t border-slate-800">
                    <div className="text-sm text-slate-400 font-medium">Secure Verification</div>
                </div>
            </div>

            {/* Right - OTP Form */}
            <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative -mt-24 lg:mt-0 rounded-t-3xl lg:rounded-none z-10">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="animate-fade-in pt-4 lg:pt-0">
                        <div className="hidden lg:block mb-10">
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Enter verification code</h2>
                            <p className="mt-2 text-sm text-slate-600">Check your inbox for the 6-digit code.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${digit ? 'border-indigo-400 bg-indigo-50 text-indigo-700 focus:ring-indigo-500' : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button type="submit" disabled={loading || otp.join('').length !== 6}
                                className="w-full flex justify-center items-center py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all duration-300"
                            >
                                {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Verifying...</> : 'Verify Email'}
                            </button>

                            <div className="text-center text-sm text-slate-500">
                                Didn't receive the code?{' '}
                                <button type="button" onClick={handleResend} disabled={resending}
                                    className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50">
                                    {resending ? <><RefreshCw className="h-3 w-3 animate-spin" /> Resending...</> : 'Resend'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
