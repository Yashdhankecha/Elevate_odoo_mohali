import React from 'react';
import { 
  FaBriefcase, 
  FaUsers, 
  FaCheckCircle, 
  FaTrophy, 
  FaArrowUp 
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const DashboardOverview = () => {
  const dashboardStats = [
    { 
      label: 'Total Jobs Posted', 
      value: '23', 
      change: '+15%', 
      icon: FaBriefcase, 
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Applications Received', 
      value: '847', 
      change: '+22%', 
      icon: FaUsers, 
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Shortlisted', 
      value: '156', 
      change: '+8%', 
      icon: FaCheckCircle, 
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Offers Released', 
      value: '47', 
      change: '+12%', 
      icon: FaTrophy, 
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const applicationTrends = [
    { month: 'Jan', applications: 120 },
    { month: 'Feb', applications: 135 },
    { month: 'Mar', applications: 148 },
    { month: 'Apr', applications: 162 },
    { month: 'May', applications: 178 },
    { month: 'Jun', applications: 195 }
  ];

  const statusDistribution = [
    { name: 'Applied', value: 60, color: '#3B82F6' },
    { name: 'Shortlisted', value: 25, color: '#10B981' },
    { name: 'Interview', value: 15, color: '#F59E0B' },
    { name: 'Offered', value: 10, color: '#8B5CF6' },
    { name: 'Rejected', value: 5, color: '#EF4444' }
  ];

  const recentApplications = [
    { name: 'Priya Sharma', role: 'Software Engineer', time: '2 min ago', status: 'New' },
    { name: 'Arjun Patel', role: 'Data Analyst', time: '15 min ago', status: 'New' },
    { name: 'Kavya Reddy', role: 'Product Manager', time: '1 hour ago', status: 'Viewed' },
    { name: 'Rahul Kumar', role: 'Frontend Developer', time: '2 hours ago', status: 'Viewed' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your recruitment</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <FaArrowUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {recentApplications.map((application, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{application.name}</p>
                    <p className="text-sm text-gray-600">{application.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    application.status === 'New' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {application.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{application.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All Applications →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FaBriefcase className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Post New Job</p>
                <p className="text-sm text-gray-600">Create a new job posting</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FaUsers className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Review Applications</p>
                <p className="text-sm text-gray-600">Check pending applications</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FaCheckCircle className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">Schedule Interviews</p>
                <p className="text-sm text-gray-600">Set up candidate interviews</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FaTrophy className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-gray-800">Send Offers</p>
                <p className="text-sm text-gray-600">Extend job offers to candidates</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
