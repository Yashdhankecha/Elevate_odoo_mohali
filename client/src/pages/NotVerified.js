import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaExclamationTriangle, FaEnvelope, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { resendVerification } from '../utils/api';
import { toast } from 'react-hot-toast';

const NotVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user info from location state or auth context
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

  const handleLogout = () => {
    logout();
  };

  const handleResendVerification = async () => {
    try {
      const response = await resendVerification(userEmail);
      if (response.success) {
        toast.success('Verification email sent successfully! Please check your inbox.');
      } else {
        toast.error(response.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      const message = error.response?.data?.message || 'Failed to send verification email';
      toast.error(message);
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'student':
        return 'Student';
      case 'company':
        return 'Company HR';
      case 'tpo':
        return 'TPO (Training & Placement Officer)';
      case 'superadmin':
        return 'Super Admin';
      default:
        return userRole?.toUpperCase() || 'User';
    }
  };

  const getVerificationMessage = () => {
    switch (userRole) {
      case 'student':
        return 'To access your student dashboard and start building your career, please verify your email address. This helps us ensure the security of your account and enables important features like job applications and profile management.';
      case 'company':
        return 'To access your company dashboard and start posting jobs, please verify your email address. This helps us ensure the security of your account and enables important features like job posting and candidate management.';
      case 'tpo':
        return 'To access your TPO dashboard and start managing student placements, please verify your email address. This helps us ensure the security of your account and enables important features like student management and job coordination.';
      default:
        return 'To access your dashboard, please verify your email address. This helps us ensure the security of your account and enables all platform features.';
    }
  };

  const getExpectedFeatures = () => {
    switch (userRole) {
      case 'student':
        return [
          'Build and manage your professional profile',
          'Apply for jobs and internships',
          'Access practice sessions and skill development',
          'Track your application status',
          'Connect with AI Career Coach',
          'View placement history and statistics'
        ];
      case 'company':
        return [
          'Post job openings and internships',
          'Review and manage student applications',
          'Schedule interviews and assessments',
          'Access student profiles and resumes',
          'Generate placement reports',
          'Manage company profile and settings'
        ];
      case 'tpo':
        return [
          'Manage student profiles and placements',
          'Coordinate with companies for job postings',
          'Track placement statistics and reports',
          'Organize campus recruitment drives',
          'Approve student profiles',
          'Generate institutional reports'
        ];
      default:
        return ['Access to your personalized dashboard', 'Full platform features'];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <FaExclamationTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Email Verification Required
          </h1>
          <p className="text-lg text-gray-600">
            Welcome, {getRoleDisplayName()}!
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-800">
              Account Not Verified
            </h2>
          </div>
          <p className="text-red-700 leading-relaxed">
            {getVerificationMessage()}
          </p>
        </div>

        {/* What You'll Get After Verification */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaCheckCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-800">
              What You'll Get After Verification
            </h2>
          </div>
          <ul className="space-y-3">
            {getExpectedFeatures().map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaEnvelope className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Verification Email Sent
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            We've sent a verification email to your registered email address. Please check your inbox and click the verification link to activate your account.
          </p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Email Address:</strong> {userEmail}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Account Type:</strong> {getRoleDisplayName()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Status:</strong> <span className="text-red-600 font-medium">Email Verification Required</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleResendVerification}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaEnvelope className="w-4 h-4" />
            Resend Verification Email
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaCheckCircle className="w-4 h-4" />
            I've Verified My Email
          </button>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaArrowRight className="w-4 h-4" />
            Back to Login
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Can't find the email? Check your spam folder. If you continue to have issues, contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotVerified;
