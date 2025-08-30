import React from 'react';
import { 
  FaUsers, 
  FaBuilding, 
  FaGraduationCap, 
  FaUserShield,
  FaChartLine,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDatabase
} from 'react-icons/fa';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '15,847',
      change: '+12%',
      changeType: 'positive',
      icon: FaUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Companies',
      value: '289',
      change: '+8',
      changeType: 'positive',
      icon: FaBuilding,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Institutions',
      value: '156',
      change: '+5',
      changeType: 'positive',
      icon: FaGraduationCap,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '+3',
      changeType: 'warning',
      icon: FaUserShield,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'System Health',
      value: '99.8%',
      change: '+0.2%',
      changeType: 'positive',
      icon: FaShieldAlt,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Data Storage',
      value: '2.4TB',
      change: '+15%',
      changeType: 'neutral',
      icon: FaDatabase,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  const recentActivities = [
    { 
      id: 1, 
      message: 'New admin registration: John Smith from IIT Delhi', 
      time: '2 min ago', 
      type: 'admin',
      status: 'pending'
    },
    { 
      id: 2, 
      message: 'Company approval request: TechCorp Solutions', 
      time: '1 hour ago', 
      type: 'company',
      status: 'pending'
    },
    { 
      id: 3, 
      message: 'System backup completed successfully', 
      time: '3 hours ago', 
      type: 'system',
      status: 'completed'
    },
    { 
      id: 4, 
      message: 'Security alert: Multiple failed login attempts detected', 
      time: '5 hours ago', 
      type: 'security',
      status: 'warning'
    },
    { 
      id: 5, 
      message: 'New institution registration: NIT Surathkal', 
      time: '1 day ago', 
      type: 'institution',
      status: 'completed'
    }
  ];

  const pendingApprovals = [
    { type: 'Admin', count: 8, priority: 'high' },
    { type: 'Company', count: 15, priority: 'medium' },
    { type: 'Institution', count: 3, priority: 'low' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-orange-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'warning':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShieldAlt className="text-red-600" />
            System Overview
          </h2>
          <p className="text-gray-600">Monitor system health, user activities, and pending approvals</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaUserShield className="w-4 h-4" />
            Review Approvals
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
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'warning' ? 'text-orange-600' :
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserShield className="text-orange-600" />
            Pending Approvals
          </h3>
          <div className="space-y-4">
            {pendingApprovals.map((approval, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{approval.type}</p>
                  <p className="text-sm text-gray-600">{approval.count} requests</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  approval.priority === 'high' ? 'bg-red-100 text-red-700' :
                  approval.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {approval.priority}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors">
            Review All Approvals
          </button>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-600" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="mt-1">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.status)}`}>
                      {activity.type}
                    </span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
            View All Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
