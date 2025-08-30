import React from 'react';
import { 
  FaBookOpen, 
  FaPlay, 
  FaChartBar, 
  FaUsers, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaTrophy,
  FaClock
} from 'react-icons/fa';

const PracticeHub = () => {
  const practiceCategories = [
    { label: 'Coding', icon: FaChartBar, color: 'text-blue-500', accuracy: 85 },
    { label: 'Aptitude', icon: FaUsers, color: 'text-green-500', accuracy: 92 },
    { label: 'Reasoning', icon: FaExclamationTriangle, color: 'text-purple-500', accuracy: 78 },
    { label: 'English', icon: FaBookOpen, color: 'text-yellow-500', accuracy: 88 },
    { label: 'Company', icon: FaCheckCircle, color: 'text-red-500', accuracy: 90 }
  ];

  const recentSessions = [
    { topic: 'Arrays & Strings', score: 95, time: '2 hours ago' },
    { topic: 'Probability', score: 87, time: '1 day ago' },
    { topic: 'Graphs', score: 91, time: '2 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Practice Hub</h2>
          <p className="text-gray-600">Master your skills with comprehensive practice tests</p>
        </div>
        <button className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-4 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-indigo-500 transition text-sm font-medium">
          Start Practice
        </button>
      </div>

      {/* Practice Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Practice Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {practiceCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="border rounded-xl p-3 flex flex-col items-center hover:shadow-lg transition bg-white cursor-pointer">
                <Icon className={`w-8 h-8 mb-1 ${category.color}`} />
                <div className="font-medium text-center">{category.label}</div>
                <div className="text-xs text-gray-500">{category.accuracy}% accuracy</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Practice Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Practice Sessions</h3>
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                <span className="font-medium">{session.topic}</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">{session.score}%</span>
                  <span className="text-xs text-gray-500">{session.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Position */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leaderboard Position</h3>
          <div className="bg-yellow-50 rounded-lg px-3 py-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-yellow-600">#12</span>
            <span className="text-xs text-gray-500 mb-1">Out of 2,847 students</span>
            <span className="text-xs text-yellow-700 text-center">
              🔥 You're in the top 1%! Keep practicing to reach top 10.
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center">
          <FaTrophy className="w-8 h-8 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-blue-600">47</div>
          <div className="text-xs text-gray-500">Total Sessions</div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
          <FaCheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-green-600">92%</div>
          <div className="text-xs text-gray-500">Avg Accuracy</div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center">
          <FaClock className="w-8 h-8 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-purple-600">24h</div>
          <div className="text-xs text-gray-500">Study Time</div>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center">
          <FaChartBar className="w-8 h-8 text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-orange-600">15</div>
          <div className="text-xs text-gray-500">Topics Mastered</div>
        </div>
      </div>
    </div>
  );
};

export default PracticeHub;
