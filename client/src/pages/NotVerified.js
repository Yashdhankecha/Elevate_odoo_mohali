import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { resendVerification } from '../utils/api';
import { FaExclamationTriangle, FaEnvelope, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const NotVerified = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, message } = location.state || {};
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
        if (!email) {
            toast.error('No email address found. Please sign up again.');
            return;
        }
        setResending(true);
        try {
            await resendVerification(email);
            toast.success('Verification email sent!');
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            toast.error('Failed to send verification email');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-10 text-center">
                {/* Warning Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-rose-50 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaExclamationTriangle className="text-rose-500 text-4xl" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">Email Not Verified</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">
                    {message || 'Please verify your email address to access your dashboard.'}
                </p>
                {email && (
                    <p className="text-sm text-gray-600 font-semibold mb-8">
                        Verification link was sent to <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{email}</span>
                    </p>
                )}

                <div className="space-y-3">
                    <button onClick={handleResend} disabled={resending}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
                    >
                        {resending ? (
                            <><FaSpinner className="animate-spin" size={14} /> Sending...</>
                        ) : (
                            <><FaEnvelope size={14} /> Resend Verification Email</>
                        )}
                    </button>

                    <Link to="/login"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all duration-300"
                    >
                        <FaArrowLeft size={14} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotVerified;
