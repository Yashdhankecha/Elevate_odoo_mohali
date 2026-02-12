import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { forgotPassword } = useAuth();

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ general: 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Mobile Header - Visible only on small screens */}
      <div className="lg:hidden bg-slate-900 p-6 text-white pb-32">
        <div className="flex items-center justify-between mb-8">
          <Link to="/login" className="inline-flex items-center text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Link>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-bold text-white">E</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 tracking-tight">Account Recovery</h1>
        <p className="text-sm text-slate-300">We will help you reset your password.</p>
      </div>

      {/* Left Panel - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between text-white p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="relative z-10 w-full">
          <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mb-auto mt-20">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 shadow-indigo-500/20">
              <span className="text-3xl font-bold text-white">E</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Account Recovery</h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Don't worry, we'll guide you through the process of getting back into your account safely.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="relative z-10 w-full pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span>Secure Process</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative -mt-24 lg:mt-0 rounded-t-3xl lg:rounded-none z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">

          {submitted ? (
            <div className="animate-fade-in text-center pt-8 lg:pt-0">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We've sent a password reset link to <br />
                <span className="font-semibold text-slate-900 bg-slate-50 px-2 py-0.5 rounded">{email}</span>
              </p>
              <div className="text-sm text-slate-500">
                Didn't receive the email? <button onClick={() => setSubmitted(false)} className="text-indigo-600 hover:text-indigo-500 font-medium underline-offset-2 hover:underline">Click to retry</button>
              </div>
              <div className="mt-8">
                <Link to="/login" className="w-full flex justify-center items-center py-3.5 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in pt-4 lg:pt-0">
              <div className="text-center lg:text-left mb-10">
                <div className="hidden lg:flex mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">E</span>
                  </div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Forgot password?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              {errors.general && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fade-in">
                  <div className="mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  <p className="text-sm text-red-600 font-medium">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5 focus:text-indigo-600 transition-colors">
                    Email address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 sm:text-sm shadow-sm ${errors.email
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-200 hover:border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Sending instructions...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </div>

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
