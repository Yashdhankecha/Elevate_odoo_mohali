import React from 'react';
import { 
  FaUsers, 
  FaBuilding, 
  FaBriefcase, 
  FaGraduationCap,
  FaChartLine,
  FaTrophy,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,847',
      change: '+12%',
      changeType: 'positive',
      icon: FaUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Companies',
      value: '127',
      change: '+15',
      changeType: 'positive',
      icon: FaBuilding,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Offers',
      value: '847',
      change: '+12%',
      changeType: 'positive',
      icon: FaTrophy,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Avg Package',
      value: '₹8.5L',
      change: '+8%',
      changeType: 'positive',
      icon: FaChartLine,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Placement Rate',
      value: '89.4%',
      change: '+5%',
      changeType: 'positive',
      icon: FaCheckCircle,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Upcoming Drives',
      value: '23',
      change: 'Next 2 weeks',
      changeType: 'neutral',
      icon: FaCalendarAlt,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  const recentActivities = [
    { id: 1, message: 'Google Inc. completed placement drive with 23 offers', time: '2 hours ago', type: 'success' },
    { id: 2, message: 'Microsoft scheduled technical round for Dec 20th', time: '4 hours ago', type: 'info' },
    { id: 3, message: 'Amazon HR round completed with 15 students', time: '1 day ago', type: 'success' },
    { id: 4, message: 'New company registration: TechCorp Solutions', time: '2 days ago', type: 'info' }
  ];

  return (
    <div className="space-y-6">
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
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Department Performance</p>
              <p className="text-2xl font-bold">92%</p>
            </div>
            <FaGraduationCap className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Interview Success</p>
              <p className="text-2xl font-bold">73%</p>
            </div>
            <FaCheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Offer Acceptance</p>
              <p className="text-2xl font-bold">89%</p>
            </div>
            <FaTrophy className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Company Satisfaction</p>
              <p className="text-2xl font-bold">4.8</p>
            </div>
            <FaChartLine className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-green-500' : 
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
