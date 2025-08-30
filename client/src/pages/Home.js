import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiShieldCheck, HiLockClosed, HiAcademicCap, HiOfficeBuilding, HiChartBar } from 'react-icons/hi';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const getDisplayName = () => {
    if (!user) return 'User';
    switch (user.role) {
      case 'student': return user.student?.name || 'Student';
      case 'company': return user.company?.companyName || 'Company';
      case 'tpo': return user.tpo?.name || 'TPO';
      default: return 'User';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <HiShieldCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Elevate Your
            <span className="text-blue-600"> Career</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive placement tracking platform connecting students, companies, and TPOs. 
            Streamline the recruitment process and track career progress with ease.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-600 text-white text-lg px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-flex items-center justify-center"
            >
              <HiAcademicCap className="w-5 h-5 mr-2" />
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-gray-200 text-gray-800 text-lg px-8 py-3 rounded-md hover:bg-gray-300 transition-colors duration-200 inline-flex items-center justify-center"
            >
              <HiLockClosed className="w-5 h-5 mr-2" />
              Sign In
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={getDisplayName()}
                  className="w-16 h-16 rounded-full mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <HiShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
              )}
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {getDisplayName()}!
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-blue-600 font-medium capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link to="/profile" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                View Profile
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiAcademicCap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Student Dashboard
          </h3>
          <p className="text-gray-600">
            Track your placement progress, manage applications, and showcase your skills to potential employers.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOfficeBuilding className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Company Portal
          </h3>
          <p className="text-gray-600">
            Post job opportunities, review applications, and connect with talented students from top institutions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiChartBar className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            TPO Analytics
          </h3>
          <p className="text-gray-600">
            Monitor placement statistics, track student success, and generate comprehensive reports for your institution.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How Elevate Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900">Sign Up</h3>
            <p className="text-sm text-gray-600">Choose your role and create your account</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900">Complete Profile</h3>
            <p className="text-sm text-gray-600">Fill in your details and preferences</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-yellow-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900">Connect</h3>
            <p className="text-sm text-gray-600">Find opportunities or candidates</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-purple-600">4</span>
            </div>
            <h3 className="font-semibold text-gray-900">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your placement journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
