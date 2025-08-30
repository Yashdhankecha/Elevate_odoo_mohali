import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiMail, HiClock, HiCheckCircle } from 'react-icons/hi';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from location state
  const { userId, email, username } = location.state || {};

  // Redirect if no user data
  useEffect(() => {
    if (!userId || !email || !username) {
      navigate('/register');
    }
  }, [userId, email, username, navigate]);

  // Countdown timer
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateForm = () => {
    const otpString = otp.join('');
    const newErrors = {};

    if (otpString.length !== 6) {
      newErrors.otp = 'Please enter the complete 6-digit code';
    } else if (!/^\d{6}$/.test(otpString)) {
      newErrors.otp = 'OTP must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const otpString = otp.join('');
      const result = await verifyOTP(userId, otpString);
      if (result.success) {
        // OTP verification successful, user will be redirected by auth context
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    // This would typically call a resend OTP API endpoint
    // For now, we'll just reset the timer
    setTimeLeft(600);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    // Focus first input
    const firstInput = document.getElementById('otp-0');
    if (firstInput) firstInput.focus();
  };

  if (!userId || !email || !username) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <HiMail className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to
          </p>
          <p className="text-sm font-medium text-primary-600">{email}</p>
        </div>

        {/* OTP Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* OTP Input Fields */}
            <div>
              <label className="form-label text-center block">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center space-x-2 mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
              )}
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <HiClock className="w-4 h-4" />
                <span>Code expires in: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || timeLeft === 0}
                className="btn-primary w-full flex justify-center items-center py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <HiCheckCircle className="w-5 h-5 mr-2" />
                    Verify Email
                  </>
                )}
              </button>
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                >
                  Resend verification code
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Didn't receive the code? You can resend in {formatTime(timeLeft)}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Having trouble?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Try registering again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
