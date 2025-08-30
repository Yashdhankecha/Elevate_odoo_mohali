import React, { useState, useEffect } from 'react';
import { 
  FaBuilding, 
  FaSearch, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaSort
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

const CompanyApproval = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyRequests, setCompanyRequests] = useState([]);
  const [processingApproval, setProcessingApproval] = useState(false);

  useEffect(() => {
    fetchCompanyRequests();
  }, []);

  const fetchCompanyRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/pending-registrations');
      
      // Filter only company registrations
      const companyOnly = response.data.pendingUsers.filter(user => user.role === 'company');
      setCompanyRequests(companyOnly);
    } catch (err) {
      console.error('Error fetching company requests:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load company requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCompany = async (companyId) => {
    try {
      setProcessingApproval(true);
      await api.post(`/admin/approve-user/${companyId}`);
      alert('Company approved successfully!');
      fetchCompanyRequests(); // Refresh the list
      setShowModal(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error('Error approving company:', error);
      alert('Failed to approve company: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingApproval(false);
    }
  };

  const handleRejectCompany = async (companyId) => {
    try {
      setProcessingApproval(true);
      await api.post(`/admin/reject-user/${companyId}`);
      alert('Company rejected successfully!');
      fetchCompanyRequests(); // Refresh the list
      setShowModal(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error('Error rejecting company:', error);
      alert('Failed to reject company: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingApproval(false);
    }
  };





  const filteredCompanies = companyRequests.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (company.instituteName && company.instituteName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Only show pending companies for approval
    return matchesSearch && company.status === 'pending';
  });

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company approval requests...</p>
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
            onClick={fetchCompanyRequests} 
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
            <FaBuilding className="text-purple-600" />
            Pending Company Approvals
          </h2>
          <p className="text-gray-600">Review and approve pending company registration requests</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCompanyRequests}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="Refresh data"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by company name, email, or institute..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Company Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <FaBuilding className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.instituteName || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                        {company.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(company)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApproveCompany(company.id)}
                          disabled={processingApproval}
                          className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                          title="Approve Company"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRejectCompany(company.id)}
                          disabled={processingApproval}
                          className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                          title="Reject Company"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FaBuilding className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No pending company approvals</p>
                      <p className="text-sm">There are currently no company registration requests waiting for approval.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Details Modal */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Company Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Company Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Company Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Name</label>
                      <p className="text-gray-800">{selectedCompany.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Institute/Company Name</label>
                      <p className="text-gray-800">{selectedCompany.instituteName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-800">{selectedCompany.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Role</label>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                        {selectedCompany.role?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                        {selectedCompany.status?.charAt(0).toUpperCase() + selectedCompany.status?.slice(1) || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registration Date</label>
                      <p className="text-gray-800">{selectedCompany.createdAt ? new Date(selectedCompany.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h4>
                  <p className="text-gray-600 text-sm">
                    This company registration is currently pending approval. Review the details above and use the action buttons below to approve or reject the registration.
                  </p>
                </div>

                {/* Action Buttons */}
                {selectedCompany.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApproveCompany(selectedCompany.id);
                        setShowModal(false);
                      }}
                      disabled={processingApproval}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleRejectCompany(selectedCompany.id);
                        setShowModal(false);
                      }}
                      disabled={processingApproval}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaTimes className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApproval;

