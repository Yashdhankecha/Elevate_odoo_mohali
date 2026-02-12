import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiMail, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { CheckCircle, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const { forgotPassword } = useAuth();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email || errors.general) setErrors({});
  };

  const validateForm = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Email is invalid' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSubmitted(true);
      } else {
        setErrors({ general: result.message || 'Failed to send reset link' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-indigo-100 mb-6 hover-lift">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">E</div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Password <span className="text-gradient">Recovery</span></h1>
          <p className="text-slate-500 font-medium">We'll help you get back on track</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 animate-slide-up">
          {submitted ? (
            <div className="text-center py-4 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Check Your Inbox</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                We've sent a password reset link to:<br />
                <span className="font-bold text-slate-800 bg-slate-50 px-3 py-1 rounded-lg mt-2 inline-block">{email}</span>
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full py-4 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                >
                  Didn't get the email? Try again
                </button>
                <Link to="/login" className="btn-secondary w-full py-4 flex items-center justify-center gap-2">
                  <HiArrowLeft className="h-5 w-5" /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-fade-in text-rose-600 text-sm font-semibold text-center">
                  {errors.general}
                </div>
              )}

              <div>
                <label className="form-label px-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                    <HiMail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className={`input-field pl-12 ${errors.email ? 'border-rose-300 ring-rose-200 ring-2' : ''}`}
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="mt-2 text-xs text-rose-500 font-medium px-1">{errors.email}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send Reset link
                      <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <Link to="/login" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                  <HiArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
