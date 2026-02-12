import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClock, FaShieldAlt, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { Loader2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

const ApprovalInProcess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const checkStatus = async () => {
        setIsChecking(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.user;

                if (user.status === 'active') {
                    let dashboardRoute = '/profile';
                    switch (user.role) {
                        case 'student': dashboardRoute = '/student-dashboard'; break;
                        case 'company': dashboardRoute = '/company-dashboard'; break;
                        case 'tpo': dashboardRoute = '/tpo-dashboard'; break;
                        case 'superadmin': dashboardRoute = '/superadmin-dashboard'; break;
                    }
                    navigate(dashboardRoute);
                    return;
                }
                setUserRole(user.role);
                setUserEmail(user.email);
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error checking status:', error);
        } finally {
            setTimeout(() => setIsChecking(false), 800);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        const roleFromState = location.state?.role;
        const emailFromState = location.state?.email;
        if (roleFromState && emailFromState) {
            setUserRole(roleFromState);
            setUserEmail(emailFromState);
        } else {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role && user.email) {
                setUserRole(user.role);
                setUserEmail(user.email);
            }
        }
        checkStatus();
    }, [location]);

    const features = {
        student: ['Submit Applications', 'Build Career Portfolio', 'AI Skill Insights'],
        company: ['Manage Recruitment', 'Post Opportunities', 'Filter Talent'],
        tpo: ['Drive Coordination', 'Student Analytics', 'Institutional Control']
    }[userRole] || ['Dashboard Access', 'All Platform Features'];

    return (
        <div className="min-h-screen bg-gradient-mesh relative flex items-center justify-center p-4 overflow-hidden py-12">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-8 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="max-w-xl w-full relative z-10">
                <div className="glass-card rounded-[2.5rem] p-8 md:p-12 animate-slide-up">
                    <div className="text-center mb-10">
                        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100 relative">
                            <FaClock className="h-10 w-10 text-amber-500 animate-spin-slow" />
                            <div className="absolute -top-1 -right-1">
                                <ShieldCheck className="h-8 w-8 text-indigo-500 fill-indigo-50" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 font-display">Review in <span className="text-gradient">Progress</span></h1>
                        <p className="text-slate-500 font-medium font-sans">Our admins are verifying your <span className="text-indigo-600 font-bold uppercase text-xs tracking-widest">{userRole}</span> profile.</p>
                    </div>

                    <div className="bg-white/40 rounded-3xl p-6 mb-8 border border-white/60 backdrop-blur-md shadow-sm">
                        <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-5 text-sm">
                            <Sparkles className="h-4 w-4 text-amber-500" /> Unlock after approval:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-white/50">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    <span className="text-sm font-semibold text-slate-700">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={checkStatus} disabled={isChecking}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-3 group text-lg relative overflow-hidden"
                        >
                            {isChecking ? <Loader2 className="animate-spin" /> : <><FaShieldAlt className="h-4 w-4" /> Check Status Now</>}
                        </button>
                        <button onClick={handleLogout} className="btn-secondary w-full py-4 flex items-center justify-center gap-2 font-bold text-slate-500 hover:text-rose-500 hover:border-rose-100 transition-all">
                            <FaSignOutAlt className="h-4 w-4" /> Sign Out from {userEmail}
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100/50 text-center">
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                            Verification usually takes 24-48 hours. You'll be redirected automatically as soon as your account is activated.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalInProcess;