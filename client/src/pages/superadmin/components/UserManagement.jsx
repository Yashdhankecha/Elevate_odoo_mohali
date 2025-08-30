import React, { useState } from 'react';
import { 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaUserShield,
  FaBuilding,
  FaGraduationCap,
  FaUser,
  FaCalendarAlt,
  FaDownload,
  FaSort,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const users = [
    {
      id: 1,
      name: 'Dr. John Smith',
      email: 'john.smith@iitdelhi.ac.in',
      role: 'admin',
      institution: 'IIT Delhi',
      status: 'active',
      lastLogin: '2024-12-15 10:30',
      registeredDate: '2024-01-15',
      phone: '+91-98765-43210',
      department: 'Computer Science',
      permissions: ['User Management', 'Company Approval', 'Reports Access']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      role: 'company',
      institution: 'TechCorp Solutions',
      status: 'active',
      lastLogin: '2024-12-15 09:15',
      registeredDate: '2024-02-20',
      phone: '+91-87654-32109',
      department: 'HR',
      permissions: ['Job Posting', 'Application Management', 'Interview Scheduling']
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@bitspilani.ac.in',
      role: 'admin',
      institution: 'BITS Pilani',
      status: 'active',
      lastLogin: '2024-12-14 16:45',
      registeredDate: '2024-01-10',
      phone: '+91-76543-21098',
      department: 'Training & Placement',
      permissions: ['Student Management', 'Company Management', 'Placement Drives']
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@student.com',
      role: 'student',
      institution: 'IIT Delhi',
      status: 'inactive',
      lastLogin: '2024-12-10 14:20',
      registeredDate: '2024-03-01',
      phone: '+91-65432-10987',
      department: 'Computer Science',
      permissions: ['Job Applications', 'Resume Builder', 'Practice Hub']
    }
  ];

  const roles = ['All', 'Admin', 'Company', 'Student', 'TPO'];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-green-100 text-green-700';
      case 'company': return 'bg-purple-100 text-purple-700';
      case 'student': return 'bg-blue-100 text-blue-700';
      case 'tpo': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="w-5 h-5 text-green-600" />;
      case 'company': return <FaBuilding className="w-5 h-5 text-purple-600" />;
      case 'student': return <FaUser className="w-5 h-5 text-blue-600" />;
      case 'tpo': return <FaGraduationCap className="w-5 h-5 text-orange-600" />;
      default: return <FaUser className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole.toLowerCase();
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus.toLowerCase();
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEdit = (userId) => {
    // Handle edit logic
    console.log('Editing user:', userId);
  };

  const handleDelete = (userId) => {
    // Handle delete logic
    console.log('Deleting user:', userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-orange-600" />
            User Management
          </h2>
          <p className="text-gray-600">Manage all users across the platform</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaPlus className="w-4 h-4" />
            Add User
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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
                placeholder="Search by name, email, or institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    User Details
                    <FaSort className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{user.institution}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{user.phone}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-green-600 hover:text-green-900 p-1"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
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

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">User Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-800">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-800">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-800">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Department</label>
                      <p className="text-gray-800">{selectedUser.department}</p>
                    </div>
                  </div>
                </div>

                {/* Role & Institution */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Role & Institution</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Role</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Institution</label>
                      <p className="text-gray-800">{selectedUser.institution}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Registered Date</label>
                      <p className="text-gray-800">{selectedUser.registeredDate}</p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedUser.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FaCheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleEdit(selectedUser.id);
                      setShowModal(false);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit User
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedUser.id);
                      setShowModal(false);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
