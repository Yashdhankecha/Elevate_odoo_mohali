import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaExclamationTriangle, FaEnvelope, FaCheckCircle, FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { resendVerification } from '../utils/api';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, ShieldAlert, Sparkles } from 'lucide-react';

const NotVerified = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const emailFromState = location.state?.email;
        const roleFromState = location.state?.role;
        if (emailFromState && roleFromState) {
            setUserEmail(emailFromState);
            setUserRole(roleFromState);
        } else if (user) {
            setUserEmail(user.email);
            setUserRole(user.role);
        }
    }, [location, user]);

    const handleResendVerification = async () => {
        setLoading(true);
        try {
            const response = await resendVerification(userEmail);
            if (response.success) toast.success('Verification link sent!');
        } catch (error) {
            toast.error('Failed to send link');
        } finally {
            setLoading(false);
        }
    };

    const features = {
        student: ['Build Professional Resume', 'Apply to top MNCs', 'AI Skill assessments'],
        company: ['Post Unlimited Jobs', 'Candidate Shortlisting', 'Direct TPO Connect'],
        tpo: ['Manage Student Database', 'Placement Analytics', 'Drive Coordination']
    }[userRole] || ['Dashboard Access', 'Profile Completion'];

    return (
        <div className="min-h-screen bg-gradient-mesh relative flex items-center justify-center p-4 overflow-hidden py-12">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-8 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="max-w-xl w-full relative z-10">
                <div className="glass-card rounded-[2.5rem] p-8 md:p-12 animate-slide-up">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100">
                            <ShieldAlert className="h-10 w-10 text-rose-500 animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Almost There!</h1>
                        <p className="text-slate-500 font-medium italic">We need to verify <span className="text-indigo-600 font-bold">{userEmail}</span></p>
                    </div>

                    <div className="bg-indigo-50/50 rounded-3xl p-6 mb-8 border border-indigo-100 backdrop-blur-sm">
                        <h3 className="flex items-center gap-2 text-indigo-900 font-bold mb-4 uppercase tracking-wider text-xs">
                            <Sparkles className="h-4 w-4" /> Why verify?
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {features.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleResendVerification} disabled={loading}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-3 group text-lg"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Mail className="h-5 w-5" /> Resend Verification Link</>}
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => window.location.reload()} className="btn-secondary py-3 flex items-center justify-center gap-2 font-bold text-emerald-600 border-emerald-100 hover:bg-emerald-50">
                                <FaCheckCircle className="h-4 w-4" /> I've Verified
                            </button>
                            <button onClick={logout} className="btn-secondary py-3 flex items-center justify-center gap-2 font-bold text-slate-500">
                                <FaSignOutAlt className="h-4 w-4" /> Logout
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100/50 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            Can't find the email? Check your <span className="font-bold underline">Spam</span> folder.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotVerified;