import React from 'react';
import { 
  FaBriefcase, 
  FaFilter, 
  FaUser, 
  FaBuilding,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimes
} from 'react-icons/fa';

const Applications = () => {
  const jobCategories = [
    { label: 'Software Engineering', count: 152, salary: '₹8-25 LPA', color: 'text-blue-600' },
    { label: 'Data Science', count: 89, salary: '₹10-30 LPA', color: 'text-green-600' },
    { label: 'Product Management', count: 67, salary: '₹12-35 LPA', color: 'text-purple-600' }
  ];

  const recentApplications = [
    {
      id: 1,
      logo: <FaBuilding className="w-8 h-8 text-blue-400" />,
      role: 'Software Engineer Intern',
      company: 'Google',
      salary: '₹15-20 LPA',
      status: { label: 'Interview Scheduled', color: 'bg-yellow-100 text-yellow-700' },
      appliedDate: 'Dec 10, 2024'
    },
    {
      id: 2,
      logo: <FaBuilding className="w-8 h-8 text-green-400" />,
      role: 'Product Manager Intern',
      company: 'Microsoft',
      salary: '₹18-25 LPA',
      status: { label: 'Test Completed', color: 'bg-blue-100 text-blue-700' },
      appliedDate: 'Dec 8, 2024'
    },
    {
      id: 3,
      logo: <FaBuilding className="w-8 h-8 text-purple-400" />,
      role: 'iOS Developer Intern',
      company: 'Apple',
      salary: '₹20-28 LPA',
      status: { label: 'Offer Received', color: 'bg-green-100 text-green-700' },
      appliedDate: 'Dec 5, 2024'
    },
    {
      id: 4,
      logo: <FaBuilding className="w-8 h-8 text-red-400" />,
      role: 'Backend Developer',
      company: 'Netflix',
      salary: '₹22-30 LPA',
      status: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
      appliedDate: 'Dec 3, 2024'
    }
  ];

  const applicationStats = [
    { label: 'Total Applied', value: '12', color: 'text-blue-600' },
    { label: 'In Progress', value: '5', color: 'text-yellow-600' },
    { label: 'Offers', value: '2', color: 'text-green-600' },
    { label: 'Rejected', value: '3', color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Application Vault</h2>
          <p className="text-gray-600">Track your job applications and opportunities</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 border px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition">
            <FaFilter className="w-4 h-4" /> Filter
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition text-sm font-medium">
            Browse Jobs
          </button>
        </div>
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {applicationStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Job Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Job Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobCategories.map((category, index) => (
            <div key={index} className="border rounded-xl p-4 flex flex-col hover:shadow-xl transition cursor-pointer bg-gradient-to-br from-gray-50 to-white">
              <div className={`font-medium mb-1 ${category.color}`}>{category.label}</div>
              <div className="text-xs text-gray-500 mb-2">{category.count} opportunities available</div>
              <div className="text-sm font-semibold">{category.salary}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h3>
        <div className="space-y-3">
          {recentApplications.map((application) => (
            <div key={application.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-3 hover:bg-gray-100 transition-colors">
              {application.logo}
              <div className="flex-1">
                <div className="font-medium">{application.role}</div>
                <div className="text-xs text-gray-500">{application.company}</div>
                <div className="text-xs text-gray-500">Applied: {application.appliedDate}</div>
              </div>
              <div className="font-semibold text-sm">{application.salary}</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${application.status.color}`}>
                {application.status.label}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                  <FaEye className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-green-600 transition-colors">
                  <FaEdit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="w-6 h-6 text-blue-500" />
            <div>
              <h4 className="font-medium text-blue-700">Application Success Rate</h4>
              <p className="text-sm text-blue-600">75% of your applications are progressing</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-3">
            <FaClock className="w-6 h-6 text-green-500" />
            <div>
              <h4 className="font-medium text-green-700">Average Response Time</h4>
              <p className="text-sm text-green-600">3-5 days for most companies</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-3">
            <FaBriefcase className="w-6 h-6 text-purple-500" />
            <div>
              <h4 className="font-medium text-purple-700">Active Opportunities</h4>
              <p className="text-sm text-purple-600">5 interviews scheduled this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
