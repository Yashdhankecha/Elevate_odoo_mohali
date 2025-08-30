
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardOverview from './components/DashboardOverview';
import ResumeBuilder from './components/ResumeBuilder';
import PracticeHub from './components/PracticeHub';
import SkillTracker from './components/SkillTracker';
import Applications from './components/Applications';
import JobBrowse from './components/JobBrowse';
import PlacementHistory from './components/PlacementHistory';
import AICareerCoach from './components/AICareerCoach';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [skillProgress, setSkillProgress] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [achievements, setAchievements] = useState({ achievements: [], certifications: [] });
  const [experience, setExperience] = useState({ projects: [], internships: [] });
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);


  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'resume':
        return <ResumeBuilder />;
      case 'practice':
        return <PracticeHub />;
      case 'skills':
        return <SkillTracker />;
      case 'applications':
        return <Applications />;
      case 'jobs':
        return <JobBrowse setActiveSection={setActiveSection} />;
      case 'history':
        return <PlacementHistory />;
      case 'ai-coach':
        return <AICareerCoach />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {student.name || 'Student'}! Track your progress and stay ahead.
              </p>
    </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Profile Completion</p>
                <p className="text-2xl font-bold text-blue-600">{stats.profileCompletion || 0}%</p>
        </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <HiUser className="w-8 h-8 text-blue-600" />
          </div>
          </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HiAcademicCap className="w-6 h-6 text-blue-600" />
        </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">CGPA</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cgpa || 0}</p>
      </div>
    </div>
  </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <HiBriefcase className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HiPuzzle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skills</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSkills || 0}</p>
      </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <HiStar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProjects || 0}</p>
      </div>
    </div>
    </div>
  </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Resume Builder Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resume Builder</h3>
                <HiDocumentText className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Personal Information</span>
                  <span className="text-sm font-medium text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Education Details</span>
                  <span className="text-sm font-medium text-green-600">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills & Certifications</span>
                  <span className="text-sm font-medium text-yellow-600">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience & Projects</span>
                  <span className="text-sm font-medium text-yellow-600">In Progress</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Update Resume
        </button>
      </div>

            {/* Practice Hub Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Practice Hub</h3>
                <HiLightningBolt className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                {practiceHistory.slice(0, 3).map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.topic}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{session.accuracy}%</p>
                      <p className="text-xs text-gray-500">Accuracy</p>
    </div>
        </div>
      ))}
    </div>
              <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Start Practice
              </button>
            </div>

            {/* Skill Progress Tracker */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skill Progress Tracker</h3>
                <HiTrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-4">
                {skillProgress.slice(0, 4).map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
          </div>
        ))}
      </div>
              <button className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                View All Skills
              </button>
    </div>
  </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Application Vault */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Application Vault</h3>
                <HiBriefcase className="w-5 h-5 text-blue-600" />
        </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.applicationStatusBreakdown?.applied || 0}</p>
                    <p className="text-xs text-gray-600">Applied</p>
      </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{stats.applicationStatusBreakdown?.shortlisted || 0}</p>
                    <p className="text-xs text-gray-600">Shortlisted</p>
        </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.applicationStatusBreakdown?.selected || 0}</p>
                    <p className="text-xs text-gray-600">Selected</p>
      </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{stats.applicationStatusBreakdown?.rejected || 0}</p>
                    <p className="text-xs text-gray-600">Rejected</p>
      </div>
    </div>
  </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                View Applications
        </button>
            </div>

            {/* Smart Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Smart Alerts</h3>
                <HiExclamation className="w-5 h-5 text-orange-600" />
              </div>
              <div className="space-y-3">
                {alertsData.slice(0, 3).map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.priority === 'high' ? 'border-red-500 bg-red-50' :
                    alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                View All Alerts
        </button>
      </div>

            {/* Placement History */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Placement History</h3>
                <HiOfficeBuilding className="w-5 h-5 text-green-600" />
    </div>
              <div className="space-y-3">
                {stats.placementDetails ? (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800">Placed at {stats.placementDetails.company}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {stats.placementDetails.role} • {stats.placementDetails.package?.amount} {stats.placementDetails.package?.currency}
                    </p>
      </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">No placement yet</p>
                    <p className="text-xs text-gray-500 mt-1">Keep applying and improving your skills!</p>
      </div>
                )}
      </div>
              <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
              <HiChartBar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{analyticsData.successRate || 0}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{analyticsData.interviewRate || 0}%</p>
                <p className="text-sm text-gray-600">Interview Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{analyticsData.metrics?.testPassRate || 0}%</p>
                <p className="text-sm text-gray-600">Test Pass Rate</p>
          </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{analyticsData.metrics?.profileRating || 0}</p>
                <p className="text-sm text-gray-600">Profile Rating</p>
        </div>
      </div>
    </div>
  </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <HiClock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {experience.projects?.slice(0, 2).map((project, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Added new project: {project.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date().toLocaleDateString()} • {project.technologies?.join(', ')}
                    </p>
      </div>
    </div>
              ))}
              {experience.internships?.slice(0, 2).map((internship, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Completed internship at {internship.company}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date().toLocaleDateString()} • {internship.role}
                    </p>
        </div>
      </div>
              ))}
      </div>
    </div>
  </div>
      </div>
    </div>
  );
};

export default StudentDashboard;


