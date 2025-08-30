import React from 'react';
import { FaClock, FaShieldAlt, FaEnvelope } from 'react-icons/fa';

const ApprovalPending = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <FaClock className="w-10 h-10 text-orange-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Approval Pending
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your TPO account requires superadmin approval before activation. 
          Our super administrators will review your registration and approve your account.
          You will be able to access your dashboard once approved.
        </p>

        {/* Status Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-orange-700">
            <FaShieldAlt className="w-5 h-5" />
            <span className="font-medium">Status: Pending Superadmin Approval</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
            <FaEnvelope className="w-4 h-4" />
            <span className="font-medium">Need Help?</span>
          </div>
          <p className="text-sm text-blue-600">
            If you have any questions, please contact our support team.
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ApprovalPending;
