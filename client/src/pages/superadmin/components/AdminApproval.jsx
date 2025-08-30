import React, { useState } from 'react';
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
  FaSort
} from 'react-icons/fa';

const AdminApproval = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const adminRequests = [
    {
      id: 1,
      name: 'Dr. John Smith',
      email: 'john.smith@iitdelhi.ac.in',
      phone: '+91-98765-43210',
      institution: 'IIT Delhi',
      department: 'Computer Science',
      designation: 'Associate Professor',
      experience: '8 years',
      education: 'PhD in Computer Science',
      status: 'pending',
      submittedDate: '2024-12-15',
      documents: ['ID Proof', 'Experience Certificate', 'Educational Certificates'],
      reason: 'Need admin access for managing student placements and company interactions',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Prof. Sarah Johnson',
      email: 'sarah.johnson@nitb.ac.in',
      phone: '+91-87654-32109',
      institution: 'NIT Bangalore',
      department: 'Training & Placement',
      designation: 'Training & Placement Officer',
      experience: '12 years',
      education: 'M.Tech in Management',
      status: 'pending',
      submittedDate: '2024-12-14',
      documents: ['ID Proof', 'Experience Certificate', 'Appointment Letter'],
      reason: 'Require admin privileges to manage placement activities and student data',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Dr. Michael Chen',
      email: 'michael.chen@bitspilani.ac.in',
      phone: '+91-76543-21098',
      institution: 'BITS Pilani',
      department: 'Career Services',
      designation: 'Director',
      experience: '15 years',
      education: 'PhD in Business Administration',
      status: 'approved',
      submittedDate: '2024-12-10',
      documents: ['ID Proof', 'Experience Certificate', 'Educational Certificates'],
      reason: 'Administrative access needed for comprehensive career services management',
      priority: 'high'
    },
    {
      id: 4,
      name: 'Prof. Emily Davis',
      email: 'emily.davis@iitb.ac.in',
      phone: '+91-65432-10987',
      institution: 'IIT Bombay',
      department: 'Student Affairs',
      designation: 'Assistant Professor',
      experience: '6 years',
      education: 'PhD in Psychology',
      status: 'rejected',
      submittedDate: '2024-12-08',
      documents: ['ID Proof', 'Experience Certificate'],
      reason: 'Need access for student counseling and placement support',
      priority: 'low'
    }
  ];

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

  const filteredAdmins = adminRequests.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || admin.status === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const handleApprove = (adminId) => {
    // Handle approval logic
    console.log('Approving admin:', adminId);
  };

  const handleReject = (adminId) => {
    // Handle rejection logic
    console.log('Rejecting admin:', adminId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserShield className="text-green-600" />
            Admin Approval Management
          </h2>
          <p className="text-gray-600">Review and approve admin registration requests from institutions</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaDownload className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, institution, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FaFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    Admin Details
                    <FaSort className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <FaUserShield className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                        <div className="text-sm text-gray-500">{admin.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{admin.institution}</div>
                      <div className="text-sm text-gray-500">{admin.department}</div>
                      <div className="text-sm text-gray-500">{admin.designation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{admin.experience}</div>
                      <div className="text-sm text-gray-500">{admin.education}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(admin.status)}`}>
                      {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(admin.priority)}`}>
                      {admin.priority.charAt(0).toUpperCase() + admin.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(admin)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      {admin.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(admin.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(admin.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <FaTimes className="w-4 h-4" />
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

      {/* Admin Details Modal */}
      {showModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Admin Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-800">{selectedAdmin.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-800">{selectedAdmin.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-800">{selectedAdmin.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Experience</label>
                      <p className="text-gray-800">{selectedAdmin.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Institution</label>
                      <p className="text-gray-800">{selectedAdmin.institution}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Department</label>
                      <p className="text-gray-800">{selectedAdmin.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Designation</label>
                      <p className="text-gray-800">{selectedAdmin.designation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Education</label>
                      <p className="text-gray-800">{selectedAdmin.education}</p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Request Details</h4>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reason for Admin Access</label>
                    <p className="text-gray-800 mt-1">{selectedAdmin.reason}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Submitted Documents</label>
                    <div className="mt-2 space-y-1">
                      {selectedAdmin.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FaDownload className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedAdmin.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove(selectedAdmin.id);
                        setShowModal(false);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedAdmin.id);
                        setShowModal(false);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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

export default AdminApproval;
