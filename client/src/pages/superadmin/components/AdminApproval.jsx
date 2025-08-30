import React, { useState, useEffect } from 'react';
import { 
  FaUserShield, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBuilding,
  FaCalendarAlt,
  FaDownload,
  FaSort,
  FaSpinner,
  FaExclamationTriangle,
  FaSync
} from 'react-icons/fa';

import { getAdminApprovals, approveUser } from '../../../utils/api';
import toast from 'react-hot-toast';

const AdminApproval = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminRequests, setAdminRequests] = useState([]);

  const [processingApproval, setProcessingApproval] = useState(false);


  useEffect(() => {
    fetchAdminRequests();
  }, []);

  const fetchAdminRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdminApprovals();
      setAdminRequests(data);
    } catch (err) {
      console.error('Error fetching admin requests:', err);
      setError(err.message || 'Failed to load admin requests');

    } finally {
      setLoading(false);
    }
  };


  const handleApprove = async (userId, status) => {
    try {
      setProcessingApproval(true);
      await approveUser(userId, status);
      toast.success(`Admin ${status} successfully`);
      fetchAdminRequests(); // Refresh the list
      setShowModal(false);
      setSelectedAdmin(null);
    } catch (err) {
      console.error('Error processing approval:', err);
      toast.error(err.message || 'Failed to process approval');
    } finally {
      setProcessingApproval(false);
    }
  };

  const filteredRequests = adminRequests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.institution.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || request.status === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin approval requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAdminRequests} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-gray-600">Loading admin requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAdminRequests}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserShield className="text-red-600" />
            Admin Approval Requests
          </h2>
          <p className="text-gray-600">Review and approve new admin registration requests</p>
        </div>
        <div className="flex gap-2">
          <button 

            onClick={() => fetchAdminRequests()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaSort className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {filteredRequests.length} Admin Request{filteredRequests.length !== 1 ? 's' : ''}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">{request.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(request.priority)}`}>
                        {request.priority} priority
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                  <div className="flex items-center gap-2">
                          <FaEnvelope className="w-4 h-4 text-gray-400" />
                          <span>{request.email}</span>
                  </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="w-4 h-4 text-gray-400" />
                          <span>{request.phone}</span>
                      </div>
                        <div className="flex items-center gap-2">
                          <FaGraduationCap className="w-4 h-4 text-gray-400" />
                          <span>{request.institution}</span>
                      </div>
                    </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="w-4 h-4 text-gray-400" />
                          <span>{request.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUserShield className="w-4 h-4 text-gray-400" />
                          <span>{request.designation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                          <span>Submitted: {request.submittedDate}</span>
                        </div>
                    </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Reason for access:</strong> {request.reason}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {request.documents.map((doc, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {doc}
                    </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col gap-2">
                      <button

                      onClick={() => {
                        setSelectedAdmin(request);
                        setShowModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                      View Details
                      </button>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                          <button

                          onClick={() => handleApprove(request.id, 'approved')}
                          disabled={processingApproval}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            <FaCheck className="w-4 h-4" />
                          Approve
                          </button>
                          <button
                          onClick={() => handleApprove(request.id, 'rejected')}
                          disabled={processingApproval}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            <FaTimes className="w-4 h-4" />
                          Reject
                          </button>
                      </div>
                      )}
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <FaUserShield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No admin requests found</p>
              <p className="text-sm">There are currently no pending admin approval requests.</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Admin Request Details</h3>
                <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAdmin(null);
                }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedAdmin.name}</p>
                </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedAdmin.email}</p>
                    </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedAdmin.phone}</p>
                    </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <p className="text-gray-900">{selectedAdmin.institution}</p>
                    </div>
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <p className="text-gray-900">{selectedAdmin.department}</p>
                    </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <p className="text-gray-900">{selectedAdmin.designation}</p>
                  </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <p className="text-gray-900">{selectedAdmin.experience}</p>
                    </div>
              
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <p className="text-gray-900">{selectedAdmin.education}</p>
                    </div>
              
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Access</label>
                <p className="text-gray-900">{selectedAdmin.reason}</p>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Documents</label>
                <div className="flex flex-wrap gap-2">
                      {selectedAdmin.documents.map((doc, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {doc}
                    </span>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedAdmin.status === 'pending' && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button

                  onClick={() => handleApprove(selectedAdmin.id, 'approved')}
                  disabled={processingApproval}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <FaCheck className="w-4 h-4" />
                  Approve Request
                    </button>
                    <button
                  onClick={() => handleApprove(selectedAdmin.id, 'rejected')}
                  disabled={processingApproval}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <FaTimes className="w-4 h-4" />
                  Reject Request

                    </button>
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApproval;
