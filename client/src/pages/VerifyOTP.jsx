import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiMail, HiClock, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { CheckCircle, Loader2 } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [timeLeft, setTimeLeft] = useState(600);
    const [canResend, setCanResend] = useState(false);

    const { verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, email, role } = location.state || {};

    useEffect(() => {
        if (!userId || !email) navigate('/signup');
    }, [userId, email, navigate]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
        if (errors.otp) setErrors({});
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setErrors({ otp: 'Please enter all 6 digits' });
            return;
        }

        setLoading(true);
        try {
            await verifyOTP(userId, otpString);
        } catch (error) {
            setErrors({ otp: 'Verification failed. Try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!userId || !email) return null;

    return (
        <div className="min-h-screen bg-gradient-mesh relative flex items-center justify-center p-4 overflow-hidden py-12">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-indigo-100 mb-6 hover-lift">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold italic">V</div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Verify <span className="text-gradient">Email</span></h1>
                    <p className="text-slate-500 font-medium px-6">We've sent a 6-digit verification code to <span className="text-indigo-600 font-bold">{email}</span></p>
                </div>

                <div className="glass-card rounded-[2.5rem] p-8 md:p-10 animate-slide-up text-center">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-between gap-2 md:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength="1"
                                    className={`w-full h-14 md:h-16 text-center text-2xl font-bold bg-white/50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 ${errors.otp ? 'border-rose-300 ring-rose-100' : 'border-slate-100 focus:border-indigo-500 focus:ring-indigo-100'
                                        }`}
                                    value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        {errors.otp && <p className="text-rose-500 text-sm font-bold animate-fade-in">{errors.otp}</p>}

                        <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-sm bg-slate-50/50 py-3 rounded-2xl backdrop-blur-sm px-4 inline-flex mx-auto">
                            <HiClock className={`h-5 w-5 ${timeLeft < 120 ? 'text-amber-500 animate-pulse' : 'text-indigo-500'}`} />
                            <span>Expires in: {formatTime(timeLeft)}</span>
                        </div>

                        <div className="space-y-4 pt-2">
                            <button
                                type="submit" disabled={loading || timeLeft === 0}
                                className="btn-primary w-full py-4 flex items-center justify-center gap-2 group text-lg font-bold"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Verify & Continue <CheckCircle className="h-5 w-5 transition-transform group-hover:scale-110" /></>}
                            </button>

                            <div className="pt-4 flex flex-col gap-4">
                                {canResend ? (
                                    <button type="button" onClick={() => { setTimeLeft(600); setCanResend(false); setOtp(['', '', '', '', '', '']); }} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                        Didn't get the code? Resend
                                    </button>
                                ) : (
                                    <p className="text-slate-400 text-xs font-medium">Wait {formatTime(timeLeft)} to resend code</p>
                                )}

                                <button type="button" onClick={() => navigate('/signup')} className="text-slate-400 font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 text-sm bg-slate-50/5 hover:bg-slate-50/20 py-2 rounded-xl">
                                    <HiArrowLeft className="h-4 w-4" /> Start Over
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;