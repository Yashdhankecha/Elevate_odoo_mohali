import React from 'react';
import { 
  FaFileAlt, 
  FaBookOpen, 
  FaChartBar, 
  FaBriefcase, 
  FaHistory,
  FaTrophy,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaBullseye
} from 'react-icons/fa';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Applications Submitted',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: FaBriefcase,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Practice Sessions',
      value: '47',
      change: '+8',
      changeType: 'positive',
      icon: FaBookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Skills Mastered',
      value: '15',
      change: '+2',
      changeType: 'positive',
      icon: FaChartBar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Avg Test Score',
      value: '92%',
      change: '+5%',
      changeType: 'positive',
      icon: FaTrophy,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Interviews Scheduled',
      value: '3',
      change: 'Next week',
      changeType: 'neutral',
      icon: FaCalendarAlt,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Profile Completion',
      value: '85%',
      change: '+10%',
      changeType: 'positive',
      icon: FaCheckCircle,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  const recentActivities = [
    { id: 1, message: 'Applied for Software Engineer position at Google', time: '2 hours ago', type: 'success' },
    { id: 2, message: 'Completed Data Structures practice test with 95% accuracy', time: '4 hours ago', type: 'success' },
    { id: 3, message: 'Interview scheduled with Amazon for Dec 20th', time: '1 day ago', type: 'info' },
    { id: 4, message: 'Updated resume with new project experience', time: '2 days ago', type: 'info' }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Amazon Coding Test', time: 'Tomorrow, 2:00 PM', priority: 'high' },
    { id: 2, task: 'Complete System Design Practice', time: 'Dec 18, 2024', priority: 'medium' },
    { id: 3, task: 'Update LinkedIn Profile', time: 'Dec 20, 2024', priority: 'low' }
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
              <p className="text-sm opacity-90">Application Success</p>
              <p className="text-2xl font-bold">75%</p>
            </div>
            <FaCheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Practice Accuracy</p>
              <p className="text-2xl font-bold">92%</p>
            </div>
            <FaBullseye className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Interview Success</p>
              <p className="text-2xl font-bold">67%</p>
            </div>
            <FaTrophy className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Profile Rating</p>
              <p className="text-2xl font-bold">4.8</p>
            </div>
            <FaChartBar className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FaClock className={`w-4 h-4 ${
                    task.priority === 'high' ? 'text-red-500' : 
                    task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{task.task}</p>
                    <p className="text-xs text-gray-500">{task.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
