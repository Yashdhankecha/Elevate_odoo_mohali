import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiLockClosed, HiEye, HiEyeOff, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import { Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('Invalid link');
      navigate('/forgot-password');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords mismatch';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await resetPassword(token, formData.password);
      if (result.success) {
        toast.success('Password updated!');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-mesh relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-indigo-100 mb-6 font-bold text-indigo-600 text-2xl">E</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 font-display">New <span className="text-gradient">Password</span></h1>
          <p className="text-slate-500 font-medium">Protect your journey with a strong password</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-10 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="form-label px-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                    <HiLockClosed className="h-5 w-5" />
                  </div>
                  <input
                    name="password" type={showPassword ? 'text' : 'password'} required
                    className={`input-field pl-12 pr-12 ${errors.password ? 'border-rose-300 ring-rose-200 ring-2' : ''}`}
                    placeholder="••••••••" value={formData.password} onChange={handleChange}
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-4 text-slate-400 hover:text-indigo-600" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-xs text-rose-500 font-medium px-1">{errors.password}</p>}
              </div>

              <div>
                <label className="form-label px-1">Confirm New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                    <HiLockClosed className="h-5 w-5" />
                  </div>
                  <input
                    name="confirmPassword" type="password" required
                    className={`input-field pl-12 ${errors.confirmPassword ? 'border-rose-300 ring-rose-200 ring-2' : ''}`}
                    placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-2 text-xs text-rose-500 font-medium px-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 group">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Update Password <CheckCircle className="h-5 w-5 transition-transform group-hover:scale-110" /></>
              )}
            </button>

            <div className="text-center pt-2">
              <button onClick={() => navigate('/login')} className="text-slate-500 font-medium hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 w-full">
                <HiArrowLeft className="h-4 w-4" /> Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
