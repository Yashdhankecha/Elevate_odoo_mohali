import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiShieldCheck, HiLockClosed, HiMail, HiKey } from 'react-icons/hi';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <HiShieldCheck className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure Authentication
            <span className="text-primary-600"> Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A complete MERN stack authentication system with modern UI, featuring 
            email verification, Google OAuth, password reset, and secure JWT tokens.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              <HiKey className="w-5 h-5 mr-2" />
              Get Started
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
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
                  alt={user.username}
                  className="w-16 h-16 rounded-full mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <HiShieldCheck className="w-8 h-8 text-primary-600" />
                </div>
              )}
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.username}!
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link to="/profile" className="btn-primary">
                View Profile
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16 px-4">
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiMail className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Email Verification
          </h3>
          <p className="text-gray-600">
            Secure OTP verification system with automatic email delivery for account activation.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiShieldCheck className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Google OAuth
          </h3>
          <p className="text-gray-600">
            Seamless login with Google accounts, providing secure and convenient authentication.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiLockClosed className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Password Reset
          </h3>
          <p className="text-gray-600">
            Secure password recovery system with time-limited reset links sent via email.
          </p>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Built with Modern Technologies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚛️</span>
            </div>
            <h3 className="font-semibold text-gray-900">React.js</h3>
            <p className="text-sm text-gray-600">Frontend Framework</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-900">Express.js</h3>
            <p className="text-sm text-gray-600">Backend Framework</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🍃</span>
            </div>
            <h3 className="font-semibold text-gray-900">MongoDB</h3>
            <p className="text-sm text-gray-600">Database</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold text-gray-900">TailwindCSS</h3>
            <p className="text-sm text-gray-600">Styling Framework</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
