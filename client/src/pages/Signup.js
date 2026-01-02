import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUserGraduate, FaBuilding, FaChalkboardTeacher, FaSearch, FaCheckCircle } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { registerUser, getCollegesWithTPOs, searchTPOs } from '../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingColleges, setIsSearchingColleges] = useState(false);
  const [selectedTPO, setSelectedTPO] = useState(null);
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

    // Handle college name search for students
    if (name === 'collegeName' && selectedRole === 'student') {
      searchColleges(value);
    }
  };

  const searchColleges = async (collegeName) => {
    if (!collegeName || collegeName.trim().length < 2) {
      setCollegeSuggestions([]);
      setShowSuggestions(false);
      setSelectedTPO(null);
      return;
    }

    setIsSearchingColleges(true);
    try {
      const response = await searchTPOs(collegeName);
      if (response.success) {
        setCollegeSuggestions(response.tpos);
        setShowSuggestions(response.tpos.length > 0);
      }
    } catch (error) {
      console.error('Error searching colleges:', error);
      setCollegeSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearchingColleges(false);
    }
  };

  const selectCollege = (college) => {
    setFormData(prev => ({
      ...prev,
      collegeName: college.instituteName
    }));
    setSelectedTPO(college);
    setShowSuggestions(false);
    setCollegeSuggestions([]);
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
        // Validate that a college with active TPO is selected
        if (!selectedTPO) {
          toast.error('Please select a college with an active TPO from the suggestions');
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
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      
      // Handle specific error for no active TPO
      if (error.response?.data?.code === 'NO_ACTIVE_TPO') {
        toast.error('No active TPO found for this college. Please select a college from the suggestions or contact your college administration to register a TPO first.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStudentFields = () => (
    <div className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label htmlFor="rollNumber" className="block text-sm font-semibold text-gray-700 mb-2">
          Roll Number *
        </label>
        <input
          type="text"
          id="rollNumber"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="Enter your roll number"
          required
        />
      </div>

      <div>
        <label htmlFor="branch" className="block text-sm font-semibold text-gray-700 mb-2">
          Branch *
        </label>
        <input
          type="text"
          id="branch"
          name="branch"
          value={formData.branch}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="e.g., Computer Science, Mechanical, etc."
          required
        />
      </div>

      <div>
        <label htmlFor="graduationYear" className="block text-sm font-semibold text-gray-700 mb-2">
          Graduation Year *
        </label>
        <input
          type="number"
          id="graduationYear"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="e.g., 2025"
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 10}
          required
        />
      </div>

      <div className="relative">
        <label htmlFor="collegeName" className="block text-sm font-semibold text-gray-700 mb-2">
          College Name *
        </label>
        <div className="relative">
          <input
            type="text"
            id="collegeName"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleInputChange}
            onFocus={() => {
              if (collegeSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking on them
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
            placeholder="Start typing your college name..."
            required
          />
          {isSearchingColleges && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
            </div>
          )}
          {selectedTPO && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        
        {/* College Suggestions Dropdown */}
        {showSuggestions && collegeSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {collegeSuggestions.map((college, index) => (
              <div
                key={index}
                onClick={() => selectCollege(college)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{college.instituteName}</div>
                <div className="text-sm text-gray-600">
                  TPO: {college.tpoName} • {college.tpoEmail}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Selected TPO Info */}
        {selectedTPO && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <FaCheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">College verified with active TPO</span>
            </div>
            <div className="mt-1 text-sm text-green-700">
              TPO: {selectedTPO.tpoName} • Contact: {selectedTPO.tpoContact}
            </div>
          </div>
        )}
        
        {/* Help Text */}
        <div className="mt-1 text-xs text-gray-500">
          Only colleges with registered and active TPOs are allowed. Start typing to search.
        </div>
      </div>
    </div>
  );

  const renderCompanyFields = () => (
    <div className="space-y-5">
      <div>
        <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="Enter your company name"
          required
        />
      </div>

      <div>
        <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-2">
          Contact Number *
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="Enter contact number"
          required
        />
      </div>
    </div>
  );

  const renderTPOFields = () => (
    <div className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label htmlFor="instituteName" className="block text-sm font-semibold text-gray-700 mb-2">
          Institute Name *
        </label>
        <input
          type="text"
          id="instituteName"
          name="instituteName"
          value={formData.instituteName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="Enter your institute name"
          required
        />
      </div>

      <div>
        <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-2">
          Contact Number *
        </label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
          placeholder="Enter contact number"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center animate-fade-in">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">E</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">Elevate</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join the placement tracking platform</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Select Your Role</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                selectedRole === 'student'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaUserGraduate className="mx-auto text-2xl mb-2" />
              <span className="text-sm font-semibold">Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('company')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                selectedRole === 'company'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaBuilding className="mx-auto text-2xl mb-2" />
              <span className="text-sm font-semibold">Company</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('tpo')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                selectedRole === 'tpo'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaChalkboardTeacher className="mx-auto text-2xl mb-2" />
              <span className="text-sm font-semibold">TPO</span>
            </button>
          </div>

          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Common Fields */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
                    placeholder="Create a password (min. 6 characters)"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-300"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role-specific fields */}
              {selectedRole === 'student' && renderStudentFields()}
              {selectedRole === 'company' && renderCompanyFields()}
              {selectedRole === 'tpo' && renderTPOFields()}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center animate-fade-in">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;


