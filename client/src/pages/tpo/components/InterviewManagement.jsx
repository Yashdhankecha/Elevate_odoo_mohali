import React, { useState, useEffect } from 'react';
import { tpoApi } from '../../../services/tpoApi';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaChartBar,
  FaDownload
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    type: 'All',
    dateFrom: '',
    dateTo: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInterviews: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    candidate: '',
    candidateId: '',
    role: '',
    date: '',
    time: '',
    type: 'Technical',
    interviewer: '',
    location: '',
    duration: '60',
    notes: '',
    company: ''
  });

  useEffect(() => {
    fetchInterviews();
    fetchStats();
    fetchCompanies();
    fetchStudents();
  }, [filters, pagination.currentPage]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 10
      };
      const response = await tpoApi.getInterviews(params);
      setInterviews(response.interviews);
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalInterviews: response.pagination.totalInterviews
      }));
    } catch (error) {
      toast.error('Failed to fetch interviews');
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await tpoApi.getInterviewStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await tpoApi.getCompanies();
      setCompanies(response);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await tpoApi.getStudents({ limit: 1000 }); // Get all students for dropdown
      setStudents(response.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInterview) {
        await tpoApi.updateInterview(editingInterview._id, formData);
        toast.success('Interview updated successfully');
      } else {
        // Create interview
        const interviewResponse = await tpoApi.createInterview(formData);
        
        // Send notification to the student
        if (formData.candidateId) {
          try {
            await tpoApi.createNotification({
              recipient: formData.candidateId,
              type: 'interview_scheduled',
              title: 'Interview Scheduled',
              message: `Your interview for ${formData.role} at ${companies.find(c => c._id === formData.company)?.companyName || 'the company'} has been scheduled for ${new Date(formData.date).toLocaleDateString()} at ${formData.time}.`,
              interviewId: interviewResponse.data?.interview?._id,
              metadata: {
                interviewDate: formData.date,
                interviewTime: formData.time,
                role: formData.role,
                company: formData.company,
                location: formData.location,
                type: formData.type
              }
            });
          } catch (notificationError) {
            console.error('Failed to send notification:', notificationError);
            // Don't fail the interview creation if notification fails
          }
        }
        
        toast.success('Interview scheduled successfully and notification sent to student');
      }
      setShowForm(false);
      setEditingInterview(null);
      resetForm();
      fetchInterviews();
    } catch (error) {
      toast.error(error.message || 'Failed to save interview');
    }
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setFormData({
      candidate: interview.candidate,
      candidateId: interview.candidateId || '',
      role: interview.role,
      date: interview.date.split('T')[0],
      time: interview.time,
      type: interview.type,
      interviewer: interview.interviewer,
      location: interview.location,
      duration: interview.duration,
      notes: interview.notes || '',
      company: interview.company?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (interviewId) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await tpoApi.deleteInterview(interviewId);
        toast.success('Interview deleted successfully');
        fetchInterviews();
      } catch (error) {
        toast.error('Failed to delete interview');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      candidate: '',
      candidateId: '',
      role: '',
      date: '',
      time: '',
      type: 'Technical',
      interviewer: '',
      location: '',
      duration: '60',
      notes: '',
      company: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Technical': return 'bg-purple-100 text-purple-800';
      case 'HR Round': return 'bg-pink-100 text-pink-800';
      case 'Managerial': return 'bg-indigo-100 text-indigo-800';
      case 'Final': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Candidate', 'Role', 'Date', 'Time', 'Type', 'Status', 'Interviewer', 'Location', 'Company'],
      ...interviews.map(interview => [
        interview.candidate,
        interview.role,
        new Date(interview.date).toLocaleDateString(),
        interview.time,
        interview.type,
        interview.status,
        interview.interviewer,
        interview.location,
        interview.company?.companyName || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interviews_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600">Manage and track all interviews</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overview.totalInterviews}</p>
              </div>
              <FaCalendarAlt className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.overview.scheduledInterviews}</p>
              </div>
              <FaClock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.overview.completedInterviews}</p>
              </div>
              <FaChartBar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.overview.completionRate}%</p>
              </div>
              <FaChartBar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search interviews..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Technical">Technical</option>
              <option value="HR Round">HR Round</option>
              <option value="Managerial">Managerial</option>
              <option value="Final">Final</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Interview Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingInterview ? 'Edit Interview' : 'Schedule New Interview'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingInterview(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                  <select
                    required
                    value={formData.candidateId}
                    onChange={(e) => {
                      const selectedStudent = students.find(s => s._id === e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        candidateId: e.target.value,
                        candidate: selectedStudent ? selectedStudent.name : ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={students.length === 0}
                  >
                    <option value="">
                      {students.length === 0 ? 'No students available' : 'Select a student'}
                    </option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.student?.rollNumber || 'N/A'} ({student.student?.branch || 'N/A'})
                      </option>
                    ))}
                  </select>
                  {students.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No students are registered under your institute. Please contact the administrator.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Technical">Technical</option>
                    <option value="HR Round">HR Round</option>
                    <option value="Managerial">Managerial</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="30">30</option>
                    <option value="45">45</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
                  <input
                    type="text"
                    required
                    value={formData.interviewer}
                    onChange={(e) => setFormData(prev => ({ ...prev, interviewer: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <select
                    required
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Company</option>
                    {companies.map(company => (
                      <option key={company._id} value={company._id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingInterview(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingInterview ? 'Update Interview' : 'Schedule Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interviews Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : interviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No interviews found
                  </td>
                </tr>
              ) : (
                interviews.map((interview) => (
                  <tr key={interview._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {interview.candidate}
                          </div>
                          <div className="text-sm text-gray-500">
                            {interview.interviewer}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interview.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(interview.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {interview.time} ({interview.duration} min)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(interview.type)}`}>
                        {interview.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBuilding className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {interview.company?.companyName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
                            {interview.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(interview)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(interview._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewManagement;
