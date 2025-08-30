import React, { useState } from 'react';
import { 
  FaBuilding, 
  FaEdit, 
  FaUpload, 
  FaDownload, 
  FaGlobe, 
  FaEnvelope, 
  FaPhone,
  FaMapMarkerAlt,
  FaUsers,
  FaIndustry,
  FaSave,
  FaTimes
} from 'react-icons/fa';

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "TechCorp Solutions",
    logo: "🏢",
    about: "Leading technology company specializing in AI and Machine Learning solutions. We are committed to innovation and excellence in software development.",
    website: "www.techcorp.com",
    email: "hr@techcorp.com",
    phone: "+91 9876543210",
    industry: "Information Technology",
    size: "500-1000 employees",
    founded: "2015",
    location: "Bangalore, India",
    address: "Tech Park, Whitefield, Bangalore - 560066",
    description: "TechCorp Solutions is a forward-thinking technology company that develops cutting-edge software solutions for businesses worldwide. Our team of experts specializes in artificial intelligence, machine learning, and cloud computing technologies.",
    mission: "To empower businesses with innovative technology solutions that drive growth and efficiency.",
    vision: "To be the leading technology partner for businesses worldwide, known for innovation, reliability, and customer success.",
    values: [
      "Innovation and Excellence",
      "Customer Focus",
      "Integrity and Transparency",
      "Continuous Learning",
      "Team Collaboration"
    ],
    benefits: [
      "Competitive salary packages",
      "Health insurance coverage",
      "Flexible work arrangements",
      "Professional development opportunities",
      "Employee wellness programs"
    ]
  });

  const [editedData, setEditedData] = useState(companyData);

  const handleSave = () => {
    setCompanyData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(companyData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Company Profile</h1>
          <p className="text-gray-600">Manage your company information and branding</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaEdit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaSave className="w-4 h-4" />
                Save Changes
              </button>
              <button 
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  {companyData.logo}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded px-3 py-1 w-full"
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-gray-800">{companyData.name}</h3>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded px-3 py-1 w-full mt-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{companyData.industry}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{companyData.website}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{companyData.size}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.founded}
                      onChange={(e) => handleInputChange('founded', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{companyData.founded}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{companyData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">About Us</h2>
            {isEditing ? (
              <textarea
                value={editedData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                placeholder="Describe your company..."
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{companyData.about}</p>
            )}
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Mission</h2>
              {isEditing ? (
                <textarea
                  value={editedData.mission}
                  onChange={(e) => handleInputChange('mission', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                />
              ) : (
                <p className="text-gray-600">{companyData.mission}</p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Vision</h2>
              {isEditing ? (
                <textarea
                  value={editedData.vision}
                  onChange={(e) => handleInputChange('vision', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                />
              ) : (
                <p className="text-gray-600">{companyData.vision}</p>
              )}
            </div>
          </div>

          {/* Values & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Core Values</h2>
              <ul className="space-y-2">
                {companyData.values.map((value, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Employee Benefits</h2>
              <ul className="space-y-2">
                {companyData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{companyData.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Phone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{companyData.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Address</p>
                  {isEditing ? (
                    <textarea
                      value={editedData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full h-16"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{companyData.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                <FaUpload className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Upload Company Logo</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                <FaDownload className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Download Company Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                <FaGlobe className="w-4 h-4 text-gray-400" />
                <span className="text-sm">View Public Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
