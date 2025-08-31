import React, { useState, useEffect } from 'react';
import { 
  FaBriefcase, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBuilding,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSpinner
} from 'react-icons/fa';
import tpoApi from '../../../services/tpoApi';
import InternshipForm from './InternshipForm';
import { toast } from 'react-hot-toast';

const InternshipRecords = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internshipRecords, setInternshipRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchInternshipRecords();
  }, [searchQuery, filterStatus]);

  const fetchInternshipRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tpoApi.getInternshipOffers({
        search: searchQuery,
        status: filterStatus !== 'All' ? filterStatus : undefined
      });
      console.log('Internship records response:', response);
      setInternshipRecords(response.internships || response || []);
    } catch (err) {
      console.error('Error fetching internship records:', err);
      setError(err.message || 'Failed to load internship records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInternship = () => {
    setEditingInternship(null);
    setShowForm(true);
  };

  const handleEditInternship = (internship) => {
    setEditingInternship(internship);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    fetchInternshipRecords();
    setShowForm(false);
    setEditingInternship(null);
  };

  const handleDeleteInternship = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship offer?')) {
      try {
        const response = await tpoApi.deleteInternshipOffer(internshipId);
        console.log('Delete response:', response);
        if (response.success) {
          toast.success('Internship offer deleted successfully');
          fetchInternshipRecords();
        } else {
          toast.error(response.message || 'Failed to delete internship offer');
        }
      } catch (error) {
        console.error('Error deleting internship:', error);
        toast.error(error.message || 'Failed to delete internship offer');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'offer_received': return 'bg-green-100 text-green-800';
      case 'applied': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'interview_completed': return 'bg-blue-100 text-blue-800';
      case 'test_scheduled': return 'bg-purple-100 text-purple-800';
      case 'interview_scheduled': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'offer_received': return <FaCheckCircle className="w-4 h-4" />;
      case 'applied': return <FaClock className="w-4 h-4" />;
      case 'rejected': return <FaTimesCircle className="w-4 h-4" />;
      case 'interview_completed': return <FaCheckCircle className="w-4 h-4" />;
      case 'test_scheduled': return <FaClock className="w-4 h-4" />;
      case 'interview_scheduled': return <FaClock className="w-4 h-4" />;
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
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-200 rounded"></div>
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
              <h3 className="text-red-800 font-medium">Error Loading Internship Records</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchInternshipRecords}
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
          <h1 className="text-2xl font-bold text-gray-800">Internship Management</h1>
          <p className="text-gray-600">Create and manage internship offers for students</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleCreateInternship}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Create Internship</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search internships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internship Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {internshipRecords.map((internship) => (
                <tr key={internship._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaBriefcase className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{internship.title}</div>
                        <div className="text-sm text-gray-500">{internship.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                          <FaBuilding className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {internship.company?.companyName || internship.company?.name || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{internship.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(internship.isActive ? 'active' : 'inactive')}`}>
                      {getStatusIcon(internship.isActive ? 'active' : 'inactive')}
                      <span className="ml-1">{internship.isActive ? 'Active' : 'Inactive'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {internship.applicationCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {internship.deadline ? formatDate(internship.deadline) : 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditInternship(internship)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteInternship(internship._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {!loading && internshipRecords.length === 0 && (
        <div className="text-center py-12">
          <FaBriefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No internship offers found</h3>
          <p className="text-gray-500 mb-4">Create your first internship offer to get started.</p>
          <button
            onClick={handleCreateInternship}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Internship Offer
          </button>
        </div>
      )}

      {/* Summary Stats */}
      {internshipRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold text-gray-800">{internshipRecords.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBriefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {internshipRecords.filter(internship => internship.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {internshipRecords.reduce((total, internship) => total + (internship.applicationCount || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-red-600">
                  {internshipRecords.filter(internship => !internship.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaTimesCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internship Form Modal */}
      {showForm && (
        <InternshipForm
          onClose={() => {
            setShowForm(false);
            setEditingInternship(null);
          }}
          onSuccess={handleFormSuccess}
          editData={editingInternship}
        />
      )}
    </div>
  );
};

export default InternshipRecords;
