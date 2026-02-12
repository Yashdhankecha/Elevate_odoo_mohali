import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBuilding, 
  FaBriefcase, 
  FaGraduationCap,
  FaChartLine,
  FaTrophy,
  FaCalendarAlt,
  FaCheckCircle,
  FaBell,
  FaSync
} from 'react-icons/fa';
import tpoApi from '../../../services/tpoApi';
import { useNotifications } from '../../../contexts/NotificationContext';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      placedStudents: 0,
      activeCompanies: 0,
      totalApplications: 0,
      totalOffers: 0,
      averagePackage: 0,
      placementRate: 0,
      upcomingDrives: 0
    },
    recentActivities: [],
    upcomingDrives: []
  });
  
  const { notifications, unreadCount } = useNotifications();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await tpoApi.getDashboardStats();
      setDashboardData(response);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const formatPackage = (packageValue) => {
    if (packageValue >= 100000) {
      return `₹${(packageValue / 100000).toFixed(1)}L`;
    } else if (packageValue >= 1000) {
      return `₹${(packageValue / 1000).toFixed(1)}K`;
    }
    return `₹${packageValue}`;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const stats = [
    {
      title: 'Total Students',
      value: dashboardData.stats.totalStudents.toLocaleString(),
      icon: FaUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Companies',
      value: dashboardData.stats.activeCompanies.toLocaleString(),
      icon: FaBuilding,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Offers',
      value: dashboardData.stats.totalOffers.toLocaleString(),
      icon: FaTrophy,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Avg Package',
      value: formatPackage(dashboardData.stats.averagePackage),
      icon: FaChartLine,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Placement Rate',
      value: `${dashboardData.stats.placementRate}%`,
      icon: FaCheckCircle,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Upcoming Drives',
      value: dashboardData.stats.upcomingDrives.toString(),
      icon: FaCalendarAlt,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-gray-300 rounded mb-2"></div>
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <FaCheckCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Real-time placement statistics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Notification Indicator */}
          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <FaBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            title="Refresh Dashboard"
          >
            <FaSync className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {dashboardData.upcomingDrives.length > 0 ? (
            dashboardData.upcomingDrives.map((drive) => (
              <div key={drive.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{drive.title}</p>
                  <p className="text-xs text-gray-500">{drive.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(drive.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-blue-600">{drive.applications} applications</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaCalendarAlt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
