import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, 
  FaSearch, 
  FaFilter, 
  FaCheck, 
  FaTimes, 
  FaEnvelope,
  FaBuilding,
  FaCalendarAlt,
  FaUser,
  FaGraduationCap
} from 'react-icons/fa';
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const TPOApproval = ({ onApprovalProcessed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInstitute, setFilterInstitute] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingTPOs, setPendingTPOs] = useState([]);
  const [processingApproval, setProcessingApproval] = useState(false);
  const [selectedTPOs, setSelectedTPOs] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchPendingTPOs();
  }, []);

  const fetchPendingTPOs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/pending-registrations');
      
      // Filter only TPO registrations
      const tpoOnly = response.data.pendingUsers.filter(user => user.role === 'tpo');
      setPendingTPOs(tpoOnly);
    } catch (err) {
      console.error('Error fetching pending TPOs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load pending TPOs');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTPO = async (tpoId) => {
    try {
      setProcessingApproval(true);
      await api.post(`/admin/approve-user/${tpoId}`);
      alert('TPO approved successfully!');
      fetchPendingTPOs(); // Refresh the list
      if (onApprovalProcessed) {
        onApprovalProcessed();
      }
    } catch (error) {
      console.error('Error approving TPO:', error);
      alert('Failed to approve TPO: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingApproval(false);
    }
  };

  const handleRejectTPO = async (tpoId) => {
    try {
      setProcessingApproval(true);
      await api.post(`/admin/reject-user/${tpoId}`);
      alert('TPO rejected successfully!');
      fetchPendingTPOs(); // Refresh the list
      if (onApprovalProcessed) {
        onApprovalProcessed();
      }
    } catch (error) {
      console.error('Error rejecting TPO:', error);
      alert('Failed to reject TPO: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingApproval(false);
    }
  };

  const handleSelectTPO = (tpoId) => {
    setSelectedTPOs(prev => {
      const newSelected = prev.includes(tpoId) 
        ? prev.filter(id => id !== tpoId)
        : [...prev, tpoId];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    const allPendingIds = filteredAndSortedTPOs
      .filter(tpo => tpo.status === 'pending')
      .map(tpo => tpo.id);
    
    if (selectedTPOs.length === allPendingIds.length) {
      setSelectedTPOs([]);
      setShowBulkActions(false);
    } else {
      setSelectedTPOs(allPendingIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedTPOs.length === 0) return;
    
    try {
      setProcessingApproval(true);
      const promises = selectedTPOs.map(tpoId => api.post(`/admin/approve-user/${tpoId}`));
      await Promise.all(promises);
      alert(`${selectedTPOs.length} TPOs approved successfully!`);
      setSelectedTPOs([]);
      setShowBulkActions(false);
      fetchPendingTPOs();
      if (onApprovalProcessed) {
        onApprovalProcessed();
      }
    } catch (error) {
      console.error('Error in bulk approval:', error);
      alert('Failed to approve some TPOs: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingApproval(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedTPOs.length === 0) return;
    
    try {
      setProcessingApproval(true);
      const promises = selectedTPOs.map(tpoId => api.post(`/admin/reject-user/${tpoId}`));
      await Promise.all(promises);
      alert(`${selectedTPOs.length} TPOs rejected successfully!`);
      setSelectedTPOs([]);
      setShowBulkActions(false);
      fetchPendingTPOs();
      if (onApprovalProcessed) {
        onApprovalProcessed();
      }
    } catch (error) {
      console.error('Error in bulk rejection:', error);
      alert('Failed to reject some TPOs: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingApproval(false);
    }
  };

  // Get unique institutes for filter
  const uniqueInstitutes = ['All', ...new Set(pendingTPOs.map(tpo => tpo.instituteName).filter(Boolean))];

  const filteredAndSortedTPOs = pendingTPOs
    .filter(tpo => {
      const matchesSearch = tpo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tpo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (tpo.instituteName && tpo.instituteName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesInstitute = filterInstitute === 'All' || tpo.instituteName === filterInstitute;
      
      return matchesSearch && matchesInstitute;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'institute':
          return (a.instituteName || '').localeCompare(b.instituteName || '');
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'institute', label: 'Institute A-Z' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending TPOs...</p>
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
            onClick={fetchPendingTPOs} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
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
            <FaShieldAlt className="text-orange-600" />
            TPO Management
          </h2>
          <p className="text-gray-600">Review and approve new TPO registration requests</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => fetchPendingTPOs()}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="Refresh data"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Search Bar Only */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or institute..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-700">
                {selectedTPOs.length} TPO{selectedTPOs.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkApprove}
                  disabled={processingApproval}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <FaCheck className="w-3 h-3" />
                  Approve All
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={processingApproval}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <FaTimes className="w-3 h-3" />
                  Reject All
                </button>
                <button
                  onClick={() => {
                    setSelectedTPOs([]);
                    setShowBulkActions(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TPOs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {filteredAndSortedTPOs.length} Registration{filteredAndSortedTPOs.length !== 1 ? 's' : ''}
            </h3>
            {filteredAndSortedTPOs.filter(tpo => tpo.status === 'pending').length > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedTPOs.length === filteredAndSortedTPOs.filter(tpo => tpo.status === 'pending').length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="selectAll" className="text-sm text-gray-600">
                  Select All Pending
                </label>
              </div>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAndSortedTPOs.length > 0 ? (
            filteredAndSortedTPOs.map((tpo) => (
              <div key={tpo.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Checkbox for pending TPOs */}
                    {tpo.status === 'pending' && (
                      <input
                        type="checkbox"
                        checked={selectedTPOs.includes(tpo.id)}
                        onChange={() => handleSelectTPO(tpo.id)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">{tpo.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tpo.status)}`}>
                        {tpo.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {tpo.role.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="w-4 h-4 text-gray-400" />
                          <span>{tpo.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaBuilding className="w-4 h-4 text-gray-400" />
                          <span>{tpo.instituteName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                          <span>Registered: {new Date(tpo.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FaUser className="w-4 h-4 text-gray-400" />
                          <span>Role: {tpo.role.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaGraduationCap className="w-4 h-4 text-gray-400" />
                          <span>Status: {tpo.status}</span>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col gap-2">
                    {tpo.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveTPO(tpo.id)}
                          disabled={processingApproval}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <FaCheck className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectTPO(tpo.id)}
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
              <FaShieldAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No pending TPO registrations found</p>
              <p className="text-sm">There are currently no pending TPO approval requests.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TPOApproval;
