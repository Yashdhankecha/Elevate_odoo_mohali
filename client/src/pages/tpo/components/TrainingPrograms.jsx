import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import tpoApi from '../../../services/tpoApi';

const TrainingPrograms = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainingPrograms, setTrainingPrograms] = useState([]);

  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tpoApi.getTrainingPrograms();
      setTrainingPrograms(response.data.trainingPrograms);
    } catch (err) {
      console.error('Error fetching training programs:', err);
      setError(err.message || 'Failed to load training programs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <FaCheckCircle className="w-4 h-4" />;
      case 'Completed': return <FaClock className="w-4 h-4" />;
      case 'Scheduled': return <FaClock className="w-4 h-4" />;
      case 'Cancelled': return <FaTimesCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <FaTimesCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Training Programs</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchTrainingPrograms}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Training Programs</h1>
          <p className="text-gray-600">Manage and track student training programs</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <FaPlus className="w-4 h-4" />
            <span>Add Program</span>
          </button>
        </div>
      </div>

      {/* Training Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingPrograms.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <FaGraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{program.name}</h3>
                  <p className="text-sm text-gray-500">{program.duration}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                {getStatusIcon(program.status)}
                <span className="ml-1">{program.status}</span>
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <FaUsers className="w-4 h-4 mr-2 text-gray-400" />
                <span>{program.participants} participants</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                <span>Start: {formatDate(program.startDate)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                <span>End: {formatDate(program.endDate)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaEye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors">
                  <FaEdit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors">
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && trainingPrograms.length === 0 && (
        <div className="text-center py-12">
          <FaGraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No training programs found</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding your first training program
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Program
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainingPrograms;
