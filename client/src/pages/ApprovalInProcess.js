import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaHome } from 'react-icons/fa';

const ApprovalInProcess = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-10 text-center">
                {/* Animated Clock */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-amber-50 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaClock className="text-amber-500 text-4xl" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">Approval Pending</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    Your account is currently under review by the administration team.
                    This process typically takes 24-48 hours. You'll receive an email once your account is approved.
                </p>

                <div className="space-y-4 mb-8">
                    {[
                        { step: 'Account Created', done: true },
                        { step: 'Email Verified', done: true },
                        { step: 'Admin Review', done: false, active: true },
                        { step: 'Access Granted', done: false },
                    ].map((item, idx) => (
                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl text-left ${item.active ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-100 text-emerald-600' : item.active ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {item.done ? <FaCheckCircle size={14} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                            </div>
                            <span className={`text-sm font-semibold ${item.done ? 'text-emerald-700' : item.active ? 'text-amber-700' : 'text-gray-400'}`}>
                                {item.step}
                            </span>
                            {item.active && <span className="ml-auto text-[10px] font-bold text-amber-600 uppercase tracking-widest">In Progress</span>}
                        </div>
                    ))}
                </div>

                <Link to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-300"
                >
                    <FaHome size={14} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ApprovalInProcess;
