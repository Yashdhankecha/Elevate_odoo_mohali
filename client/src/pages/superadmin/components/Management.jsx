import React, { useState, useEffect } from 'react';
import { 
  FaBuilding, 
  FaShieldAlt, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIndustry,
  FaGlobe,
  FaCalendarAlt
} from 'react-icons/fa';
import axios from 'axios';

const Management = () => {
  const [activeTab, setActiveTab] = useState('tpos');
  const [tpos, setTpos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tposResponse, companiesResponse] = await Promise.all([
        api.get('/superadmin/registered-tpos'),
        api.get('/superadmin/registered-companies')
      ]);
      
      setTpos(tposResponse.data);
      setCompanies(companiesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatus, type) => {
    try {
      await api.put(`/superadmin/update-status/${id}`, { 
        status: newStatus,
        type: type 
      });
      
      // Update local state
      if (type === 'tpo') {
        setTpos(prev => prev.map(tpo => 
          tpo._id === id ? { ...tpo, status: newStatus } : tpo
        ));
      } else {
        setCompanies(prev => prev.map(company => 
          company._id === id ? { ...company, status: newStatus } : company
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTpos = tpos.filter(tpo => {
    const matchesSearch = tpo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tpo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tpo.instituteName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tpo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentData = activeTab === 'tpos' ? filteredTpos : filteredCompanies;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Management</h1>
            <p className="text-gray-600 mt-1">Manage registered TPOs and Companies</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{tpos.length}</div>
              <div className="text-sm text-gray-500">Total TPOs</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{companies.length}</div>
              <div className="text-sm text-gray-500">Total Companies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('tpos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tpos'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaShieldAlt className="inline mr-2" />
              TPOs ({tpos.length})
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'companies'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBuilding className="inline mr-2" />
              Companies ({companies.length})
            </button>
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'tpos' ? 'TPO Details' : 'Company Details'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'tpos' ? 'Institute' : 'Industry'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {currentData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                          {activeTab === 'tpos' ? (
                            <FaShieldAlt className="h-5 w-5 text-white" />
                          ) : (
                            <FaBuilding className="h-5 w-5 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {activeTab === 'tpos' ? item.name : item.companyName}
                        </div>
                        <div className="text-sm text-gray-500">{item.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <FaPhone className="h-3 w-3 text-gray-400 mr-2" />
                        {item.contactNumber || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {activeTab === 'tpos' ? item.instituteName : item.industry}
                    </div>
                    {activeTab === 'companies' && item.companySize && (
                      <div className="text-sm text-gray-500 capitalize">
                        {item.companySize} Company
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(item._id, 'active', activeTab.slice(0, -1))}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => handleStatusChange(item._id, 'rejected', activeTab.slice(0, -1))}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {currentData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {activeTab === 'tpos' ? (
                  <FaShieldAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                ) : (
                  <FaBuilding className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                )}
                <p className="text-lg font-medium">No {activeTab} found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {activeTab === 'tpos' ? 'TPO Details' : 'Company Details'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {activeTab === 'tpos' ? selectedItem.name : selectedItem.companyName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <FaEnvelope className="h-3 w-3 text-gray-400 mr-2" />
                      {selectedItem.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <FaPhone className="h-3 w-3 text-gray-400 mr-2" />
                      {selectedItem.contactNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                      {getStatusIcon(selectedItem.status)}
                      <span className="ml-1 capitalize">{selectedItem.status}</span>
                    </span>
                  </div>
                </div>

                {activeTab === 'tpos' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Institute Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedItem.instituteName}</p>
                    </div>
                    {selectedItem.designation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedItem.designation}</p>
                      </div>
                    )}
                    {selectedItem.department && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedItem.department}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Industry</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <FaIndustry className="h-3 w-3 text-gray-400 mr-2" />
                        {selectedItem.industry || 'N/A'}
                      </p>
                    </div>
                    {selectedItem.website && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <p className="mt-1 text-sm text-gray-900 flex items-center">
                          <FaGlobe className="h-3 w-3 text-gray-400 mr-2" />
                          <a href={selectedItem.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedItem.website}
                          </a>
                        </p>
                      </div>
                    )}
                    {selectedItem.companySize && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Size</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">{selectedItem.companySize}</p>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Registered Date</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FaCalendarAlt className="h-3 w-3 text-gray-400 mr-2" />
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {selectedItem.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-start">
                      <FaMapMarkerAlt className="h-3 w-3 text-gray-400 mr-2 mt-1" />
                      {Object.values(selectedItem.address).filter(Boolean).join(', ') || 'N/A'}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedItem.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedItem._id, 'active', activeTab.slice(0, -1));
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedItem._id, 'rejected', activeTab.slice(0, -1));
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
