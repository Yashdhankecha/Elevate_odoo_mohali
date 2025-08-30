import React from 'react';
import { 
  FaHistory, 
  FaDownload, 
  FaChartBar, 
  FaUser, 
  FaBuilding,
  FaTrophy,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';

const PlacementHistory = () => {
  const placementStats = [
    { label: 'Offers Received', value: '2', color: 'text-green-600' },
    { label: 'Companies Applied', value: '8', color: 'text-blue-600' },
    { label: 'Success Rate', value: '25%', color: 'text-purple-600' }
  ];

  const companyTimeline = [
    {
      id: 1,
      logo: <FaBuilding className="w-8 h-8 text-blue-400" />,
      company: 'Google',
      role: 'Software Engineer Intern',
      timeline: [
        { step: 'Applied', date: 'Nov 20', status: 'completed' },
        { step: 'Test Passed', date: 'Nov 28', status: 'completed' },
        { step: 'Interview', date: 'Dec 22', status: 'scheduled' }
      ],
      status: { label: 'Interview Scheduled', color: 'bg-yellow-100 text-yellow-700' }
    },
    {
      id: 2,
      logo: <FaBuilding className="w-8 h-8 text-purple-400" />,
      company: 'Apple',
      role: 'iOS Developer Intern',
      timeline: [
        { step: 'Applied', date: 'Oct 15', status: 'completed' },
        { step: 'Test Passed', date: 'Oct 22', status: 'completed' },
        { step: 'Interview Cleared', date: 'Nov 5', status: 'completed' },
        { step: 'Offer', date: 'Nov 12', status: 'completed' }
      ],
      status: { label: 'Offer Received', color: 'bg-green-100 text-green-700' },
      offerDetails: '₹28 LPA, Cupertino CA, Joining: July 2025'
    }
  ];

  const achievements = [
    { title: 'First Offer', description: 'Received first job offer from Apple', date: 'Nov 12, 2024', icon: FaTrophy },
    { title: 'Interview Success', description: 'Cleared 3 technical interviews', date: 'Dec 1, 2024', icon: FaCheckCircle },
    { title: 'Test Excellence', description: 'Scored 95% in Google coding test', date: 'Nov 28, 2024', icon: FaChartBar }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Placement History</h2>
          <p className="text-gray-600">Track your placement journey and achievements</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 border px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition">
            <FaDownload className="w-4 h-4" /> Export Report
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition text-sm font-medium">
            View Analytics
          </button>
        </div>
      </div>

      {/* Placement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {placementStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
            <div className="text-sm text-gray-600 text-center">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Company Application Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Application Timeline</h3>
        <div className="space-y-4">
          {companyTimeline.map((company) => (
            <div key={company.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                {company.logo}
                <div className="flex-1">
                  <div className="font-medium text-lg">{company.company}</div>
                  <div className="text-sm text-gray-500">{company.role}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${company.status.color}`}>
                  {company.status.label}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {company.timeline.map((step, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      step.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      step.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {step.step} ({step.date})
                    </span>
                    {index < company.timeline.length - 1 && <span className="text-gray-400">→</span>}
                  </div>
                ))}
              </div>
              
              {company.offerDetails && (
                <div className="text-xs text-green-700 bg-green-50 rounded px-2 py-1 inline-block">
                  {company.offerDetails}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Application Success Rate</span>
              <span className="font-semibold text-green-600">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Interview Success Rate</span>
              <span className="font-semibold text-blue-600">67%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Response Time</span>
              <span className="font-semibold text-purple-600">8 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Highest Package</span>
              <span className="font-semibold text-orange-600">₹28 LPA</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
              <FaCalendarAlt className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Google Interview</p>
                <p className="text-xs text-gray-500">Dec 22, 2024 at 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
              <FaClock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Microsoft Test</p>
                <p className="text-xs text-gray-500">Dec 25, 2024 at 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementHistory;
