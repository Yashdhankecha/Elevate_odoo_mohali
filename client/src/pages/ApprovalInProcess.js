import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClock, FaShieldAlt, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const ApprovalInProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const checkStatus = async () => {
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
        
        // If user is now active, redirect to appropriate dashboard
        if (user.status === 'active') {
          let dashboardRoute = '/profile';
          switch (user.role) {
            case 'student':
              dashboardRoute = '/student-dashboard';
              break;
            case 'company':
              dashboardRoute = '/company-dashboard';
              break;
            case 'tpo':
              dashboardRoute = '/tpo-dashboard';
              break;
            case 'superadmin':
              dashboardRoute = '/superadmin-dashboard';
              break;
          }
          navigate(dashboardRoute);
          return;
        }
        
        // Update local state with current user info
        setUserRole(user.role);
        setUserEmail(user.email);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // If token is invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    // Get user info from location state or localStorage
    const roleFromState = location.state?.role;
    const emailFromState = location.state?.email;
    
    if (roleFromState && emailFromState) {
      setUserRole(roleFromState);
      setUserEmail(emailFromState);
    } else {
      // Try to get from localStorage if available
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role && user.email) {
        setUserRole(user.role);
        setUserEmail(user.email);
      }
    }

    // Check status immediately when component mounts
    checkStatus();
  }, [location]);

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'student':
        return 'Student';
      case 'tpo':
        return 'TPO (Training & Placement Officer)';
      case 'company':
        return 'Company HR';
      case 'superadmin':
        return 'Super Admin';
      default:
        return userRole?.toUpperCase() || 'User';
    }
  };

  const getApprovalMessage = () => {
    switch (userRole) {
      case 'student':
        return 'Your student account registration is currently under review by our administrators. Once approved, you will have access to the student dashboard to build your profile and apply for jobs.';
      case 'tpo':
        return 'Your TPO account registration is currently under review by our super administrators. Once approved, you will have access to the TPO dashboard to manage student placements and job postings.';
      case 'company':
        return 'Your Company HR account registration is currently under review by our super administrators. Once approved, you will have access to the company dashboard to post jobs and manage applications.';
      default:
        return 'Your account registration is currently under review by our administrators. Please wait for approval.';
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
      case 'tpo':
        return [
          'Manage student profiles and placements',
          'Coordinate with companies for job postings',
          'Track placement statistics and reports',
          'Organize campus recruitment drives'
        ];
      case 'company':
        return [
          'Post job openings and internships',
          'Review and manage student applications',
          'Schedule interviews and assessments',
          'Access student profiles and resumes'
        ];
      default:
        return ['Access to your personalized dashboard', 'Full platform features'];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <FaClock className="w-10 h-10 text-orange-600 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Approval In Process
          </h1>
          <p className="text-lg text-gray-600">
            Welcome, {getRoleDisplayName()}!
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-orange-800">
              Account Under Review
            </h2>
          </div>
          <p className="text-orange-700 leading-relaxed">
            {getApprovalMessage()}
          </p>
        </div>

        {/* What to Expect */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaCheckCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-800">
              What You'll Get After Approval
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

        {/* Contact Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaEnvelope className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Need Assistance?
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            If you have any questions about your registration or need immediate assistance, please contact our support team.
          </p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Your Registration Email:</strong> {userEmail}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Account Type:</strong> {getRoleDisplayName()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Status:</strong> <span className="text-orange-600 font-medium">Pending Approval</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={checkStatus}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Check Status
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Approval times may vary. You will be automatically redirected to your dashboard once approved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalInProcess;
