import React, { useState, useEffect } from 'react';
import { 
  FaBriefcase, 
  FaFilter, 
  FaUser, 
  FaBuilding,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimes
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

// Application Modal Component
const ApplicationModal = ({ application, mode, onClose, onUpdate, updating, onModeChange }) => {
  const [formData, setFormData] = useState({
    coverLetter: application?.coverLetter || '',
    notes: application?.notes || '',
    resume: application?.resume || ''
  });

  // Update form data when application changes
  useEffect(() => {
    setFormData({
      coverLetter: application?.coverLetter || '',
      notes: application?.notes || '',
      resume: application?.resume || ''
    });
  }, [application]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'test_scheduled': 'bg-yellow-100 text-yellow-800',
      'test_completed': 'bg-orange-100 text-orange-800',
      'interview_scheduled': 'bg-purple-100 text-purple-800',
      'interview_completed': 'bg-indigo-100 text-indigo-800',
      'offer_received': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'applied': 'Applied',
      'test_scheduled': 'Test Scheduled',
      'test_completed': 'Test Completed',
      'interview_scheduled': 'Interview Scheduled',
      'interview_completed': 'Interview Completed',
      'offer_received': 'Offer Received',
      'rejected': 'Rejected',
      'withdrawn': 'Withdrawn'
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'view' ? 'Application Details' : 'Edit Application'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {mode === 'view' ? (
            /* View Mode */
            <div className="space-y-6">
              {/* Job Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-medium">{application.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{application.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied Date</p>
                    <p className="font-medium">{application.appliedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${application.status?.color || getStatusColor(application.status) || 'bg-gray-100 text-gray-700'}`}>
                      {application.status?.label || getStatusLabel(application.status) || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="font-medium">{application.salary}</p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Application Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Cover Letter</p>
                    <div className="bg-white rounded border p-3 text-sm">
                      {application.coverLetter || 'No cover letter provided'}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Resume</p>
                    <div className="bg-white rounded border p-3 text-sm">
                      {application.resume ? (
                        <a href={application.resume} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800">
                          View Resume
                        </a>
                      ) : (
                        'No resume uploaded'
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Notes</p>
                    <div className="bg-white rounded border p-3 text-sm">
                      {application.notes || 'No notes added'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {application.timeline && application.timeline.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Application Timeline</h3>
                  <div className="space-y-3">
                    {application.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <div>
                          <p className="font-medium text-sm">{event.action}</p>
                          <p className="text-xs text-gray-500">{event.date}</p>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                             <div className="flex gap-3 pt-4">
                 <button
                   onClick={() => onModeChange('edit')}
                   className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   Edit Application
                 </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Information (Read-only) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-medium">{application.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{application.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${application.status?.color || getStatusColor(application.status) || 'bg-gray-100 text-gray-700'}`}>
                      {application.status?.label || getStatusLabel(application.status) || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Update your cover letter..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    name="resume"
                    value={formData.resume}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any notes about this application..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Application'}
                </button>
                                 <button
                   type="button"
                   onClick={() => onModeChange('view')}
                   className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                 >
                   Cancel
                 </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Applications = () => {
  const [applicationsData, setApplicationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getApplications({ status: filter });
      setApplicationsData(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditApplication = (application) => {
    setSelectedApplication(application);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleUpdateApplication = async (updatedData) => {
    try {
      setUpdating(true);
      await studentApi.updateApplication(selectedApplication.id, updatedData);
      toast.success('Application updated successfully');
      setShowModal(false);
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setUpdating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setModalMode('view');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!applicationsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load applications</p>
        <button 
          onClick={fetchApplications}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { applications, stats, categoryStats } = applicationsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Application Vault</h2>
          <p className="text-gray-600">Track your job applications and opportunities</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            <option value="all">All Applications</option>
            <option value="applied">Applied</option>
            <option value="test_scheduled">Test Scheduled</option>
            <option value="test_completed">Test Completed</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="offer_received">Offer Received</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Applied</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
          <div className="text-sm text-gray-600">Offers</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Job Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Categories Applied</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryStats && categoryStats.map((category, index) => (
            <div key={index} className="border rounded-xl p-4 flex flex-col hover:shadow-xl transition cursor-pointer bg-gradient-to-br from-gray-50 to-white">
              <div className={`font-medium mb-1 ${category?.color || 'text-gray-600'}`}>{category?.label || 'Unknown Category'}</div>
              <div className="text-xs text-gray-500 mb-2">{category?.count || 0} opportunities available</div>
              <div className="text-sm font-semibold">{category?.salary || 'Salary not specified'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h3>
        <div className="space-y-3">
          {applications && applications.map((application, index) => (
            <div key={application.id || index} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-3 hover:bg-gray-100 transition-colors">
              {application.logo || null}
              <div className="flex-1">
                <div className="font-medium">{application.role || 'Position'}</div>
                <div className="text-xs text-gray-500">{application.company || 'Company'}</div>
                <div className="text-xs text-gray-500">Applied: {application.appliedDate || 'Date not available'}</div>
              </div>
              <div className="font-semibold text-sm">{application.salary || 'Salary not specified'}</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${application.status?.color || 'bg-gray-100 text-gray-700'}`}>
                {application.status?.label || application.status || 'Unknown'}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleViewApplication(application)}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  title="View Details"
                >
                  <FaEye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditApplication(application)}
                  className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                  title="Edit Application"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {showModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          mode={modalMode}
          onClose={closeModal}
          onUpdate={handleUpdateApplication}
          updating={updating}
          onModeChange={setModalMode}
        />
      )}
    </div>
  );
};

export default Applications;
