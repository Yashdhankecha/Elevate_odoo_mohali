import React, { useState, useEffect } from 'react';
import { 
  FaHistory, 
  FaChartBar, 
  FaUser, 
  FaBuilding,
  FaTrophy,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const PlacementHistory = () => {
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacementHistory();
  }, []);

  const fetchPlacementHistory = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getPlacementHistory();
      setPlacementData(response.data);
    } catch (error) {
      console.error('Error fetching placement history:', error);
      toast.error('Failed to load placement history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!placementData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load placement history</p>
        <button 
          onClick={fetchPlacementHistory}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { placementStats, companyTimeline, achievements, performanceSummary, upcomingEvents } = placementData;

  // Helper function to get icon component from icon name
  const getIconComponent = (iconName) => {
    const iconMap = {
      'FaTrophy': FaTrophy,
      'FaCheckCircle': FaCheckCircle,
      'FaChartBar': FaChartBar,
      'FaUser': FaUser,
      'FaBuilding': FaBuilding,
      'FaHistory': FaHistory,
      'FaClock': FaClock,
      'FaCalendarAlt': FaCalendarAlt
    };
    return iconMap[iconName] || FaTrophy;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Placement History</h2>
          <p className="text-gray-600">Track your placement journey and achievements</p>
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
                {company.logo || <FaBuilding className="w-8 h-8 text-blue-400" />}
                <div className="flex-1">
                  <div className="font-medium text-lg">{company.company || 'Company'}</div>
                  <div className="text-sm text-gray-500">{company.role || 'Position'}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${company.status?.color || 'bg-gray-100 text-gray-700'}`}>
                  {company.status?.label || 'Unknown'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {company.timeline && company.timeline.map((step, index) => (
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
          {achievements && achievements.map((achievement, index) => {
            const Icon = typeof achievement.icon === 'string' ? getIconComponent(achievement.icon) : (achievement.icon || FaTrophy);
            return (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-gray-800">{achievement.title || 'Achievement'}</h4>
                    <p className="text-xs text-gray-500">{achievement.date || 'Recent'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{achievement.description || 'Achievement description'}</p>
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
              <span className="font-semibold text-green-600">{performanceSummary?.applicationSuccessRate || '0%'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Interview Success Rate</span>
              <span className="font-semibold text-blue-600">{performanceSummary?.interviewSuccessRate || '0%'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Response Time</span>
              <span className="font-semibold text-purple-600">{performanceSummary?.averageResponseTime || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Highest Package</span>
              <span className="font-semibold text-orange-600">{performanceSummary?.highestPackage || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <FaCalendarAlt className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">{event.company || 'Company'} {event.role || 'Interview'}</p>
                    <p className="text-xs text-gray-500">{event.date || 'Date TBD'} {event.time ? `at ${event.time}` : ''}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementHistory;
