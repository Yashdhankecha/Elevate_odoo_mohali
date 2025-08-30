import React, { useState } from 'react';
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
  FaTimes
} from 'react-icons/fa';

const InterviewScheduling = () => {
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const interviews = [
    {
      id: 1,
      candidate: 'Priya Sharma',
      role: 'Software Engineer',
      date: '2024-12-18',
      time: '10:00 AM',
      type: 'Technical',
      status: 'Scheduled',
      interviewer: 'John Doe',
      location: 'Conference Room A',
      duration: '60 min',
      notes: 'Focus on React and Node.js skills'
    },
    {
      id: 2,
      candidate: 'Arjun Patel',
      role: 'Data Analyst',
      date: '2024-12-19',
      time: '2:00 PM',
      type: 'HR Round',
      status: 'Scheduled',
      interviewer: 'Sarah Johnson',
      location: 'Virtual Meeting',
      duration: '45 min',
      notes: 'Discuss career goals and company culture'
    },
    {
      id: 3,
      candidate: 'Kavya Reddy',
      role: 'Product Manager',
      date: '2024-12-20',
      time: '11:30 AM',
      type: 'Technical',
      status: 'Completed',
      interviewer: 'Mike Wilson',
      location: 'Conference Room B',
      duration: '90 min',
      notes: 'Case study discussion completed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Interview Scheduling</h1>
          <p className="text-gray-600">Manage and schedule candidate interviews</p>
        </div>
        <button 
          onClick={() => setShowInterviewModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((interview) => (
          <div key={interview.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                <FaEdit className="w-3 h-3" />
                Edit
              </button>
              {interview.status === 'Scheduled' && (
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm">
                  <FaCheck className="w-3 h-3" />
                  Join
                </button>
              )}
              <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm">
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interview Modal */}
      {showInterviewModal && (
        <InterviewModal onClose={() => setShowInterviewModal(false)} />
      )}
    </div>
  );
};

// Interview Modal Component
const InterviewModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    candidate: '',
    role: '',
    date: '',
    time: '',
    type: 'Technical',
    interviewer: '',
    location: '',
    duration: '60',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Interview data:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Schedule Interview</h2>
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
            <select
              value={formData.candidate}
              onChange={(e) => setFormData({...formData, candidate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Candidate</option>
              <option value="Priya Sharma">Priya Sharma</option>
              <option value="Arjun Patel">Arjun Patel</option>
              <option value="Kavya Reddy">Kavya Reddy</option>
            </select>
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
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Schedule Interview
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
