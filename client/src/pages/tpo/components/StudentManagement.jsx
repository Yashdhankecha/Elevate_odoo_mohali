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
  FaFileAlt
} from 'react-icons/fa';
import tpoApi from '../../../services/tpoApi';

const StudentApprovalSystem = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tpoApi.getStudents();
      setStudents(response.students);
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
      await tpoApi.approveStudent(studentId);
      fetchStudents(); // Refresh the list
      alert('Student profile approved successfully');
    } catch (error) {
      console.error('Error approving student:', error);
      const errorMessage = error.message || 'Failed to approve student. Please try again.';
      alert(errorMessage);
    }
  };

  const handleRejectStudent = async (studentId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        await tpoApi.rejectStudent(studentId, reason);
        fetchStudents(); // Refresh the list
        alert('Student profile rejected');
      } catch (error) {
        console.error('Error rejecting student:', error);
        const errorMessage = error.message || 'Failed to reject student. Please try again.';
        alert(errorMessage);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <FaCheckCircle className="w-4 h-4" />;
      case 'Rejected': return <FaTimesCircle className="w-4 h-4" />;
      case 'Pending': return <FaClock className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center">
          <FaTimesCircle className="w-5 h-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Students</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={fetchStudents}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
          <p className="text-gray-600">Review and approve student profiles</p>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CGPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUserGraduate className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name || student.student?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{student.student?.rollNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.student?.branch || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.student?.cgpa || student.student?.academicInfo?.cgpa || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.approvalStatus || 'Pending')}`}>
                      {getStatusIcon(student.approvalStatus || 'Pending')}
                      <span className="ml-1">{student.approvalStatus || 'Pending'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewStudent(student)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Profile"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      {student.approvalStatus === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveStudent(student._id)}
                            className="text-green-600 hover:text-green-900" 
                            title="Approve"
                          >
                            <FaThumbsUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectStudent(student._id)}
                            className="text-red-600 hover:text-red-900" 
                            title="Reject"
                          >
                            <FaThumbsDown className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
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
              {/* Profile Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedStudent.name || selectedStudent.student?.name || 'N/A'}</h3>
                    <p className="text-gray-600">{selectedStudent.student?.rollNumber || 'N/A'} • {selectedStudent.student?.branch || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedStudent.approvalStatus || 'Pending')}`}>
                      {getStatusIcon(selectedStudent.approvalStatus || 'Pending')}
                      <span className="ml-1">{selectedStudent.approvalStatus || 'Pending'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-800">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Roll Number</label>
                    <p className="text-gray-800">{selectedStudent.student?.rollNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-800 flex items-center">
                      <FaEnvelope className="w-4 h-4 text-gray-400 mr-2" />
                      {selectedStudent.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-gray-800 flex items-center">
                      <FaPhone className="w-4 h-4 text-gray-400 mr-2" />
                      {selectedStudent.phone || selectedStudent.student?.personalInfo?.phoneNumber || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="text-gray-800 flex items-center">
                      <FaGraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                      {selectedStudent.student?.branch || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CGPA</label>
                    <p className="text-gray-800">{selectedStudent.student?.cgpa || selectedStudent.student?.academicInfo?.cgpa || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Resume & Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FaFileAlt className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Resume</p>
                        <p className="text-xs text-gray-500">Last updated: {selectedStudent.resumeUpdatedAt ? new Date(selectedStudent.resumeUpdatedAt).toLocaleDateString() : 'Not uploaded'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FaFileAlt className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Academic Documents</p>
                        <p className="text-xs text-gray-500">Status: {selectedStudent.documentsVerified ? 'Verified' : 'Pending'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills & Certifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Certifications</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Technical Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedStudent.student?.skills?.technicalSkills?.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      )) || <p className="text-gray-500 text-sm">No skills listed</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Certifications</label>
                    <div className="space-y-2 mt-2">
                      {selectedStudent.student?.skills?.certifications?.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-800">{cert.name}</span>
                          <span className="text-xs text-gray-500">{cert.issuer}</span>
                        </div>
                      )) || <p className="text-gray-500 text-sm">No certifications listed</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Placement Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Placement Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.student?.placementInfo?.isPlaced ? 'Placed' : 'Not Placed')}`}>
                      {getStatusIcon(selectedStudent.student?.placementInfo?.isPlaced ? 'Placed' : 'Not Placed')}
                      <span className="ml-1">{selectedStudent.student?.placementInfo?.isPlaced ? 'Placed' : 'Not Placed'}</span>
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Package</label>
                    <p className="text-gray-800 flex items-center">
                      <FaBriefcase className="w-4 h-4 text-gray-400 mr-2" />
                      {formatPackage(selectedStudent.student?.placementInfo?.placementPackage)}
                    </p>
                  </div>
                  {selectedStudent.student?.placementInfo?.isPlaced && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company</label>
                        <p className="text-gray-800">{selectedStudent.student?.placementInfo?.placementCompany || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Job Title</label>
                        <p className="text-gray-800">{selectedStudent.student?.placementInfo?.placementRole || 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Application Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Applications</label>
                    <p className="text-gray-800 flex items-center">
                      <FaUserGraduate className="w-4 h-4 text-gray-400 mr-2" />
                      {selectedStudent.applications || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Offers Received</label>
                    <p className="text-gray-800 text-green-600">{selectedStudent.offers || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Actions */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Current Status: <span className="font-medium">{selectedStudent.approvalStatus || 'Pending'}</span>
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {selectedStudent.approvalStatus === 'Pending' && (
                    <>
                      <button 
                        onClick={() => handleApproveStudent(selectedStudent._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <FaThumbsUp className="w-4 h-4" />
                        <span>Approve Profile</span>
                      </button>
                      <button 
                        onClick={() => handleRejectStudent(selectedStudent._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <FaThumbsDown className="w-4 h-4" />
                        <span>Reject Profile</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApprovalSystem;
