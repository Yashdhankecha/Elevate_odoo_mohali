import React, { useState } from 'react';
import { 
  FaBullhorn, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaClock, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle
} from 'react-icons/fa';

const Announcements = () => {
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const announcements = [
    {
      id: 1,
      title: 'Interview Updates',
      message: 'Technical interviews scheduled for next week. All shortlisted candidates will receive email notifications with interview details.',
      priority: 'high',
      category: 'Interview',
      author: 'Sarah Johnson',
      createdAt: '2024-12-15T10:30:00',
      isPublished: true
    },
    {
      id: 2,
      title: 'Application Deadline Reminder',
      message: 'Reminder: Applications for Software Engineer positions close on Dec 25th. Please ensure all applications are submitted before the deadline.',
      priority: 'medium',
      category: 'Deadline',
      author: 'HR Team',
      createdAt: '2024-12-14T14:20:00',
      isPublished: true
    },
    {
      id: 3,
      title: 'Campus Visit Schedule',
      message: 'Campus recruitment drive planned for January 2025. We will be visiting multiple colleges across major cities.',
      priority: 'low',
      category: 'Event',
      author: 'Recruitment Team',
      createdAt: '2024-12-13T09:15:00',
      isPublished: true
    },
    {
      id: 4,
      title: 'New Job Postings',
      message: 'We have posted new positions for Data Scientist and Product Manager roles. Check the job portal for details.',
      priority: 'medium',
      category: 'Job Posting',
      author: 'HR Team',
      createdAt: '2024-12-12T16:45:00',
      isPublished: false
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <FaExclamationTriangle className="w-4 h-4" />;
      case 'medium':
        return <FaInfoCircle className="w-4 h-4" />;
      case 'low':
        return <FaCheckCircle className="w-4 h-4" />;
      default:
        return <FaInfoCircle className="w-4 h-4" />;
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncementModal(true);
  };

  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setShowAnnouncementModal(true);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-600">Manage company announcements and notifications</p>
        </div>
        <button 
          onClick={handleCreateAnnouncement}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {announcement.category}
                  </span>
                  {!announcement.isPublished && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{announcement.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-4">
                <span>By {announcement.author}</span>
                <div className="flex items-center gap-1">
                  <FaClock className="w-3 h-3" />
                  {formatTimeAgo(announcement.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleEditAnnouncement(announcement)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <FaEdit className="w-3 h-3" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                {announcement.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm">
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <AnnouncementModal 
          announcement={selectedAnnouncement} 
          onClose={() => setShowAnnouncementModal(false)} 
        />
      )}
    </div>
  );
};

// Announcement Modal Component
const AnnouncementModal = ({ announcement, onClose }) => {
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    message: announcement?.message || '',
    priority: announcement?.priority || 'medium',
    category: announcement?.category || 'General',
    isPublished: announcement?.isPublished || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Announcement data:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {announcement ? 'Edit Announcement' : 'New Announcement'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Announcement title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              placeholder="Announcement message..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="General">General</option>
                <option value="Interview">Interview</option>
                <option value="Deadline">Deadline</option>
                <option value="Event">Event</option>
                <option value="Job Posting">Job Posting</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              {announcement ? 'Update Announcement' : 'Create Announcement'}
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

export default Announcements;
