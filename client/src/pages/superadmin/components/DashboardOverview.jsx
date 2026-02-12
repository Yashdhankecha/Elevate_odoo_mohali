import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBuilding, 
  FaChartLine,
  FaChartPie,
  FaShieldAlt,
  FaDatabase,
  FaBriefcase,
  FaFileAlt,
  FaClock
} from 'react-icons/fa';
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const DashboardOverview = ({ onNavigateToSection }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobPostings: 0,
    totalApplications: 0,
    pendingTPOs: 0,
    pendingCompanies: 0,
    recentActivities: []
  });


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current date and previous month date
        const now = new Date();
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        
        // Fetch all data in parallel
        const [studentsRes, companiesRes, jobsRes, applicationsRes, pendingRes, activitiesRes] = await Promise.all([
          api.get('/admin/total-students'),
          api.get('/admin/total-companies'),
          api.get('/admin/total-job-postings'),
          api.get('/admin/total-applications'),
          api.get('/admin/pending-registrations'),
          api.get('/admin/recent-activities')
        ]);

        const currentStudents = studentsRes.data.count || 0;
        const currentCompanies = companiesRes.data.count || 0;
        const currentJobs = jobsRes.data.count || 0;
        const currentApplications = applicationsRes.data.count || 0;
        
        // Calculate pending approvals
        const pendingUsers = pendingRes.data.pendingUsers || [];
        const pendingTPOs = pendingUsers.filter(user => user.role === 'tpo').length;
        const pendingCompanies = pendingUsers.filter(user => user.role === 'company').length;



        setDashboardData({
          totalStudents: currentStudents,
          totalCompanies: currentCompanies,
          totalJobPostings: currentJobs,
          totalApplications: currentApplications,
          pendingTPOs: pendingTPOs,
          pendingCompanies: pendingCompanies,
          recentActivities: activitiesRes.data.activities || []
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { 
    totalStudents, 
    totalCompanies, 
    totalJobPostings, 
    totalApplications, 
    pendingTPOs,
    pendingCompanies,
    recentActivities
  } = dashboardData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-red-600" />
            <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
        </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-600">Monitor system health, user activities, and platform statistics</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              title="Refresh data"
            >
              🔄 Refresh
          </button>
        </div>
      </div>
      </div>

      {/* Stats Grid - 4 responsive cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="mb-4"></div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{totalStudents.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>

        {/* Total Companies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="mb-4"></div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{totalCompanies.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Companies</div>
        </div>

        {/* Total Job Postings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="mb-4"></div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{totalJobPostings.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Job Postings</div>
        </div>

        {/* Total Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="mb-4"></div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{totalApplications.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Applications</div>
            </div>
      </div>

      {/* Pending Approvals Section */}
      {(pendingTPOs > 0 || pendingCompanies > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-orange-600" />
            Pending Approvals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TPO Approvals */}
            {pendingTPOs > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-orange-800">TPO Management</h4>
                    <p className="text-orange-600 text-sm">{pendingTPOs} pending TPO approval{pendingTPOs !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{pendingTPOs}</div>
                </div>
                <div className="mt-3">
                  <button 
                    onClick={() => onNavigateToSection('tpo-approval')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Review TPO Approvals
                  </button>
                </div>
              </div>
            )}

            {/* Company Approvals */}
            {pendingCompanies > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-800">Company Management</h4>
                    <p className="text-purple-600 text-sm">{pendingCompanies} pending company approval{pendingCompanies !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{pendingCompanies}</div>
                </div>
                <div className="mt-3">
                  <button 
                    onClick={() => onNavigateToSection('company-approval')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Review Company Approvals
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}



                     {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Distribution Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUsers className="text-blue-600" />
              User Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students</span>
                <span className="text-lg font-bold text-blue-600">{totalStudents.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min((totalStudents / (totalStudents + totalCompanies)) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Companies</span>
                <span className="text-lg font-bold text-green-600">{totalCompanies.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min((totalCompanies / (totalStudents + totalCompanies)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Job Postings vs Applications Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaBriefcase className="text-purple-600" />
              Job Market Activity
          </h3>
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Job Postings</span>
                <span className="text-lg font-bold text-purple-600">{totalJobPostings.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min((totalJobPostings / Math.max(totalJobPostings, totalApplications, 1)) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Applications</span>
                <span className="text-lg font-bold text-orange-600">{totalApplications.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min((totalApplications / Math.max(totalJobPostings, totalApplications, 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Interactive Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartPie className="text-indigo-600" />
              Platform Overview
            </h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${(totalStudents / (totalStudents + totalCompanies)) * 100}, 100`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">{((totalStudents / (totalStudents + totalCompanies)) * 100).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Students</span>
                </div>
                <span className="font-medium">{totalStudents}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600">Companies</span>
                </div>
                <span className="font-medium">{totalCompanies}</span>
                </div>
              </div>
          </div>
        </div>

       {/* Main Content Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-600" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="mt-1">
                    <FaClock className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaDatabase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activities</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
