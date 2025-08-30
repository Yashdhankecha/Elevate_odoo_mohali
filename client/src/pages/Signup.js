import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUserGraduate, FaBuilding, FaChalkboardTeacher } from 'react-icons/fa';
import { registerUser } from '../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // Student fields
    name: '',
    rollNumber: '',
    branch: '',
    graduationYear: '',
    collegeName: '',
    // Company fields
    companyName: '',
    contactNumber: '',
    // TPO fields
    instituteName: ''
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Reset form data when role changes
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      rollNumber: '',
      branch: '',
      graduationYear: '',
      collegeName: '',
      companyName: '',
      contactNumber: '',
      instituteName: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return false;
    }

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    // Role-specific validation
    switch (selectedRole) {
      case 'student':
        if (!formData.name || !formData.rollNumber || !formData.branch || !formData.graduationYear || !formData.collegeName) {
          toast.error('Please fill in all student fields');
          return false;
        }
        break;
      case 'company':
        if (!formData.companyName || !formData.contactNumber) {
          toast.error('Please fill in all company fields');
          return false;
        }
        break;
      case 'tpo':
        if (!formData.name || !formData.instituteName || !formData.contactNumber) {
          toast.error('Please fill in all TPO fields');
          return false;
        }
        break;
      default:
        return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        role: selectedRole,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        ...formData
      };

      const response = await registerUser(payload);
      
      if (response.success) {
        toast.success(response.message);
        
        // All users (including Company and TPO) must go through OTP verification first
        navigate('/verify-otp', { 
          state: { 
            userId: response.userId, 
            email: formData.email,
            role: selectedRole 
          } 
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStudentFields = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Roll Number *
        </label>
        <input
          type="text"
          id="rollNumber"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your roll number"
          required
        />
      </div>

      <div>
        <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
          Branch *
        </label>
        <input
          type="text"
          id="branch"
          name="branch"
          value={formData.branch}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Computer Science, Mechanical, etc."
          required
        />
      </div>

      <div>
        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
          Graduation Year *
        </label>
        <input
          type="number"
          id="graduationYear"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 2025"
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 10}
          required
        />
      </div>

      <div>
        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-1">
          College Name *
        </label>
        <input
          type="text"
          id="collegeName"
          name="collegeName"
          value={formData.collegeName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your college name"
          required
        />
      </div>
    </div>
  );

  const renderCompanyFields = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your company name"
          required
        />
      </div>

      <div>
        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Number *
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter contact number"
          required
        />
      </div>
    </div>
  );

  const renderTPOFields = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700 mb-1">
          Institute Name *
        </label>
        <input
          type="text"
          id="instituteName"
          name="instituteName"
          value={formData.instituteName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your institute name"
          required
        />
      </div>

      <div>
        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Number *
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter contact number"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Elevate</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create Your Account</h2>
          <p className="text-gray-600">Join the placement tracking platform</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Role</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedRole === 'student'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <FaUserGraduate className="mx-auto text-2xl mb-2" />
              <span className="text-sm font-medium">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('company')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedRole === 'company'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <FaBuilding className="mx-auto text-2xl mb-2" />
              <span className="text-sm font-medium">Company</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('tpo')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedRole === 'tpo'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <FaChalkboardTeacher className="mx-auto text-2xl mb-2" />
              <span className="text-sm font-medium">TPO</span>
            </button>
          </div>

          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Role-specific fields */}
              {selectedRole === 'student' && renderStudentFields()}
              {selectedRole === 'company' && renderCompanyFields()}
              {selectedRole === 'tpo' && renderTPOFields()}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;


