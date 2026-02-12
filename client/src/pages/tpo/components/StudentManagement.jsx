import React, { useState, useEffect } from 'react';
import { 
  FaEye, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaGraduationCap,
  FaUserGraduate,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaThumbsUp,
  FaThumbsDown,
  FaFileAlt,
  FaFilter,
  FaSearch,
  FaCheck
} from 'react-icons/fa';
import tpoApi from '../../../services/tpoApi';

const StudentApprovalSystem = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'verified', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingStudentId, setRejectingStudentId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // studentId being acted on

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tpoApi.getStudents();
      setStudents(response.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleCloseModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
  };

  const handleApproveStudent = async (studentId) => {
    try {
      setActionLoading(studentId);
      await tpoApi.approveStudent(studentId);
      // Update the local state
      setStudents(prev => prev.map(s => 
        s._id === studentId ? { ...s, verificationStatus: 'verified' } : s
      ));
      // Also update selected student if modal is open
      if (selectedStudent && selectedStudent._id === studentId) {
        setSelectedStudent(prev => ({ ...prev, verificationStatus: 'verified' }));
      }
    } catch (error) {
      console.error('Error approving student:', error);
      const errorMessage = error.message || 'Failed to approve student. Please try again.';
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenRejectModal = (studentId) => {
    setRejectingStudentId(studentId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectStudent = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      setActionLoading(rejectingStudentId);
      await tpoApi.rejectStudent(rejectingStudentId, rejectReason);
      // Update the local state
      setStudents(prev => prev.map(s => 
        s._id === rejectingStudentId ? { ...s, verificationStatus: 'rejected', verificationNotes: rejectReason } : s
      ));
      if (selectedStudent && selectedStudent._id === rejectingStudentId) {
        setSelectedStudent(prev => ({ ...prev, verificationStatus: 'rejected', verificationNotes: rejectReason }));
      }
      setShowRejectModal(false);
      setRejectReason('');
      setRejectingStudentId(null);
    } catch (error) {
      console.error('Error rejecting student:', error);
      const errorMessage = error.message || 'Failed to reject student. Please try again.';
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Helper to get verification status (handles both old and new field names)
  const getStudentStatus = (student) => {
    // New Student model uses verificationStatus
    if (student.verificationStatus) return student.verificationStatus;
    // Old User model uses approvalStatus
    if (student.approvalStatus) {
      const map = { 'Approved': 'verified', 'Rejected': 'rejected', 'Pending': 'pending' };
      return map[student.approvalStatus] || 'pending';
    }
    return 'pending';
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case 'verified': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      default: return 'Pending';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <FaCheckCircle className="w-3.5 h-3.5" />;
      case 'rejected': return <FaTimesCircle className="w-3.5 h-3.5" />;
      case 'pending': return <FaClock className="w-3.5 h-3.5" />;
      default: return <FaClock className="w-3.5 h-3.5" />;
    }
  };

  const formatPackage = (packageValue) => {
    if (!packageValue) return 'N/A';
    if (packageValue >= 100000) {
      return `₹${(packageValue / 100000).toFixed(1)}L`;
    } else if (packageValue >= 1000) {
      return `₹${(packageValue / 1000).toFixed(1)}K`;
    }
    return `₹${packageValue}`;
  };

  // Filter students based on tab and search
  const filteredStudents = students.filter(student => {
    const status = getStudentStatus(student);
    const matchesTab = activeTab === 'all' || status === activeTab;
    const matchesSearch = !searchQuery || 
      (student.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Count stats
  const pendingCount = students.filter(s => getStudentStatus(s) === 'pending').length;
  const approvedCount = students.filter(s => getStudentStatus(s) === 'verified').length;
  const rejectedCount = students.filter(s => getStudentStatus(s) === 'rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading students...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaTimesCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-red-800 font-semibold text-lg">Error Loading Students</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={fetchStudents}
              className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Retry
            </button>
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
          <h1 className="text-2xl font-bold text-gray-800">Student Profile Approval</h1>
          <p className="text-gray-500 mt-1">Review and manage student profile verifications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FaUserGraduate className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-xs text-gray-500 font-medium">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <FaClock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              <p className="text-xs text-gray-500 font-medium">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
              <p className="text-xs text-gray-500 font-medium">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <FaTimesCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              <p className="text-xs text-gray-500 font-medium">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: students.length },
              { key: 'pending', label: 'Pending', count: pendingCount },
              { key: 'verified', label: 'Approved', count: approvedCount },
              { key: 'rejected', label: 'Rejected', count: rejectedCount },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaUserGraduate className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No Students Found</h3>
            <p className="text-gray-500 text-sm text-center max-w-sm">
              {activeTab !== 'all' 
                ? `No ${activeTab === 'verified' ? 'approved' : activeTab} students found.` 
                : 'No students are registered yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    CGPA
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((student) => {
                  const status = getStudentStatus(student);
                  return (
                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                              {(student.name || 'S')[0].toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{student.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{student.rollNumber || student.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">{student.branch || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{student.cgpa || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          {getStatusDisplayText(status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewStudent(student)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          {status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApproveStudent(student._id)}
                                disabled={actionLoading === student._id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Approve"
                              >
                                {actionLoading === student._id ? (
                                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                  <FaThumbsUp className="w-3 h-3" />
                                )}
                                Approve
                              </button>
                              <button 
                                onClick={() => handleOpenRejectModal(student._id)}
                                disabled={actionLoading === student._id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject"
                              >
                                <FaThumbsDown className="w-3 h-3" />
                                Reject
                              </button>
                            </>
                          )}
                          {status === 'rejected' && (
                            <button 
                              onClick={() => handleApproveStudent(student._id)}
                              disabled={actionLoading === student._id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Re-approve"
                            >
                              <FaCheck className="w-3 h-3" />
                              Re-approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Student Profile Review</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                      {(selectedStudent.name || 'S')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedStudent.name || 'N/A'}</h3>
                      <p className="text-gray-600 text-sm">{selectedStudent.rollNumber || 'N/A'} • {selectedStudent.branch || 'N/A'}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(getStudentStatus(selectedStudent))}`}>
                    {getStatusIcon(getStudentStatus(selectedStudent))}
                    {getStatusDisplayText(getStudentStatus(selectedStudent))}
                  </span>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserGraduate className="text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <p className="text-gray-800 mt-1 font-medium">{selectedStudent.name || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll Number</label>
                    <p className="text-gray-800 mt-1 font-medium">{selectedStudent.rollNumber || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-gray-800 mt-1 font-medium flex items-center gap-2">
                      <FaEnvelope className="w-3.5 h-3.5 text-gray-400" />
                      {selectedStudent.email || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className="text-gray-800 mt-1 font-medium flex items-center gap-2">
                      <FaPhone className="w-3.5 h-3.5 text-gray-400" />
                      {selectedStudent.phoneNumber || selectedStudent.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-indigo-600" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</label>
                    <p className="text-gray-800 mt-1 font-medium">{selectedStudent.branch || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CGPA</label>
                    <p className="text-gray-800 mt-1 font-medium">{selectedStudent.cgpa || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">College</label>
                    <p className="text-gray-800 mt-1 font-medium">{selectedStudent.collegeName || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</label>
                    <p className="text-gray-800 mt-1 font-medium">{selectedStudent.year || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBriefcase className="text-purple-600" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedStudent.skills) ? selectedStudent.skills : []).map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Notes */}
              {getStudentStatus(selectedStudent) === 'rejected' && selectedStudent.verificationNotes && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-red-800 mb-2">Rejection Reason</h3>
                  <p className="text-red-700 text-sm">{selectedStudent.verificationNotes}</p>
                </div>
              )}
            </div>

            {/* Approval Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Current Status:
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(getStudentStatus(selectedStudent))}`}>
                    {getStatusIcon(getStudentStatus(selectedStudent))}
                    {getStatusDisplayText(getStudentStatus(selectedStudent))}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Close
                  </button>
                  {getStudentStatus(selectedStudent) === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApproveStudent(selectedStudent._id)}
                        disabled={actionLoading === selectedStudent._id}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium text-sm disabled:opacity-50"
                      >
                        {actionLoading === selectedStudent._id ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          <FaThumbsUp className="w-4 h-4" />
                        )}
                        Approve Profile
                      </button>
                      <button 
                        onClick={() => {
                          handleCloseModal();
                          handleOpenRejectModal(selectedStudent._id);
                        }}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium text-sm"
                      >
                        <FaThumbsDown className="w-4 h-4" />
                        Reject Profile
                      </button>
                    </>
                  )}
                  {getStudentStatus(selectedStudent) === 'rejected' && (
                    <button 
                      onClick={() => handleApproveStudent(selectedStudent._id)}
                      disabled={actionLoading === selectedStudent._id}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium text-sm disabled:opacity-50"
                    >
                      <FaCheck className="w-4 h-4" />
                      Re-approve Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaTimesCircle className="w-5 h-5 text-red-500" />
                Reject Student Profile
              </h3>
              <p className="text-sm text-gray-500 mt-1">Please provide a reason for rejecting this profile.</p>
            </div>
            <div className="p-6">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
                autoFocus
              />
            </div>
            <div className="p-6 pt-0 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectStudent}
                disabled={!rejectReason.trim() || actionLoading}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {actionLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <FaThumbsDown className="w-4 h-4" />
                )}
                Reject Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApprovalSystem;
