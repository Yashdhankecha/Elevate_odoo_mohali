import React, { useState, useEffect } from 'react';
import { 
  FaBuilding,
  FaHistory
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

  const { companyTimeline } = placementData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Placement History</h2>
          <p className="text-gray-600">Track your placement journey</p>
        </div>
      </div>

      {/* Company Application Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaHistory className="w-5 h-5" />
          Application History
        </h3>
        <div className="space-y-4">
          {companyTimeline && companyTimeline.length > 0 ? (
            companyTimeline.map((company) => (
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaHistory className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No placement history available</p>
              <p className="text-sm">Your application history will appear here once you start applying to jobs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementHistory;
