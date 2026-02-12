import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaClock, 
  FaUsers, 
  FaVideo, 
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { 
  getCompanyInterviews, 
  createInterview, 
  updateInterview, 
  deleteInterview,
  updateInterviewStatus
} from '../../../services/companyApi';

const InterviewScheduling = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch interviews on component mount
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompanyInterviews();
      setInterviews(data);
    } catch (err) {
      setError('Failed to fetch interviews. Please try again.');
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInterview = (interview) => {
    setSelectedInterview(interview);
    setShowInterviewModal(true);
  };

  const handleCreateInterview = () => {
    setSelectedInterview(null);
    setShowInterviewModal(true);
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) {
      return;
    }

    try {
      await deleteInterview(interviewId);
      setInterviews(interviews.filter(interview => interview._id !== interviewId));
      setSuccessMessage('Interview deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete interview. Please try again.');
      console.error('Error deleting interview:', err);
    }
  };

  const handleStatusUpdate = async (interviewId, newStatus) => {
    try {
      await updateInterviewStatus(interviewId, newStatus);
      setInterviews(interviews.map(interview => 
        interview._id === interviewId 
          ? { ...interview, status: newStatus }
          : interview
      ));
      setSuccessMessage('Interview status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update interview status. Please try again.');
      console.error('Error updating interview status:', err);
    }
  };

  const handleSubmitInterview = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      if (selectedInterview) {
        // Update existing interview
        const updatedInterview = await updateInterview(selectedInterview._id, formData);
        setInterviews(interviews.map(interview => 
          interview._id === selectedInterview._id ? updatedInterview : interview
        ));
        setSuccessMessage('Interview updated successfully!');
      } else {
        // Create new interview
        const newInterview = await createInterview(formData);
        setInterviews([...interviews, newInterview]);
        setSuccessMessage('Interview scheduled successfully!');
      }

      setShowInterviewModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save interview. Please try again.');
      console.error('Error saving interview:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Interview Scheduling</h1>
          <p className="text-gray-600">Manage and schedule candidate interviews</p>
        </div>
        <button 
          onClick={handleCreateInterview}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Interview Cards */}
      {interviews.length === 0 ? (
        <div className="text-center py-12">
          <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No interviews scheduled</h3>
          <p className="text-gray-500">
            You haven't scheduled any interviews yet. Schedule your first interview!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div key={interview._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{interview.candidate}</h3>
                  <p className="text-sm text-gray-600">{interview.role}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(interview.status)}`}>
                  {interview.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="w-4 h-4" />
                  {new Date(interview.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="w-4 h-4" />
                  {interview.time} ({interview.duration})
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="w-4 h-4" />
                  {interview.interviewer}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {interview.location.includes('Virtual') ? (
                    <FaVideo className="w-4 h-4" />
                  ) : (
                    <FaMapMarkerAlt className="w-4 h-4" />
                  )}
                  {interview.location}
                </div>
              </div>

              <div className="mb-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                  {interview.type}
                </span>
              </div>

              {interview.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">{interview.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditInterview(interview)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <FaEdit className="w-3 h-3" />
                  Edit
                </button>
                {interview.status === 'Scheduled' && (
                  <button 
                    onClick={() => handleStatusUpdate(interview._id, 'In Progress')}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <FaCheck className="w-3 h-3" />
                    Start
                  </button>
                )}
                {interview.status === 'In Progress' && (
                  <button 
                    onClick={() => handleStatusUpdate(interview._id, 'Completed')}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <FaCheck className="w-3 h-3" />
                    Complete
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteInterview(interview._id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <InterviewModal 
          interview={selectedInterview} 
          onClose={() => setShowInterviewModal(false)}
          onSubmit={handleSubmitInterview}
          submitting={submitting}
        />
      )}
    </div>
  );
};

// Interview Modal Component
const InterviewModal = ({ interview, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    candidate: interview?.candidate || '',
    role: interview?.role || '',
    date: interview?.date ? interview.date.split('T')[0] : '',
    time: interview?.time || '',
    type: interview?.type || 'Technical',
    interviewer: interview?.interviewer || '',
    location: interview?.location || '',
    duration: interview?.duration || '60',
    notes: interview?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {interview ? 'Edit Interview' : 'Schedule Interview'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Candidate</label>
            <input
              type="text"
              value={formData.candidate}
              onChange={(e) => setFormData({...formData, candidate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Candidate name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Software Engineer"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Technical">Technical Round</option>
                <option value="HR Round">HR Round</option>
                <option value="Managerial">Managerial Round</option>
                <option value="Final">Final Round</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
            <input
              type="text"
              value={formData.interviewer}
              onChange={(e) => setFormData({...formData, interviewer: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Interviewer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Conference Room A or Virtual Meeting"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
              placeholder="Additional notes for the interview..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <FaSpinner className="animate-spin w-4 h-4" />}
              {interview ? 'Update Interview' : 'Schedule Interview'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewScheduling;
