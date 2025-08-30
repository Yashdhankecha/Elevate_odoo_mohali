import React, { useState } from 'react';
import { 
  FaUsers, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaGraduationCap,
  FaUserGraduate
} from 'react-icons/fa';

const StudentManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const students = [
    {
      id: 1,
      name: 'Rahul Sharma',
      rollNo: '20CS001',
      department: 'Computer Science',
      cgpa: 8.7,
      skills: ['React', 'Node.js', 'Python', 'MongoDB'],
      status: 'Placed',
      company: 'Google Inc.',
      package: '₹18.5 LPA',
      applications: 5,
      offers: 2
    },
    {
      id: 2,
      name: 'Priya Patel',
      rollNo: '20EC024',
      department: 'Electronics',
      cgpa: 9.1,
      skills: ['VLSI', 'Embedded Systems', 'C++', 'MATLAB'],
      status: 'In Process',
      company: 'Microsoft',
      package: '₹16.2 LPA',
      applications: 8,
      offers: 3
    },
    {
      id: 3,
      name: 'Arjun Kumar',
      rollNo: '20ME156',
      department: 'Mechanical',
      cgpa: 7.8,
      skills: ['AutoCAD', 'SolidWorks', 'Thermodynamics', 'Manufacturing'],
      status: 'Review',
      company: 'Tata Motors',
      package: '₹12.5 LPA',
      applications: 3,
      offers: 1
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      rollNo: '20IT045',
      department: 'Information Technology',
      cgpa: 8.9,
      skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
      status: 'Placed',
      company: 'Amazon',
      package: '₹20.1 LPA',
      applications: 6,
      offers: 2
    },
    {
      id: 5,
      name: 'Vikram Singh',
      rollNo: '20CS078',
      department: 'Computer Science',
      cgpa: 7.5,
      skills: ['JavaScript', 'React', 'Express.js', 'PostgreSQL'],
      status: 'Pending',
      company: null,
      package: null,
      applications: 2,
      offers: 0
    }
  ];

  const departments = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'Information Technology', 'Civil'];
  const statuses = ['All', 'Placed', 'In Process', 'Review', 'Pending'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-green-100 text-green-800';
      case 'In Process': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCGPAColor = (cgpa) => {
    if (cgpa >= 9.0) return 'text-green-600';
    if (cgpa >= 8.0) return 'text-blue-600';
    if (cgpa >= 7.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'All' || student.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-blue-600" />
            Student Management
          </h2>
          <p className="text-gray-600">Manage student profiles, eligibility, and placement status</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <FaFilter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">1,847</p>
            </div>
            <FaUsers className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Placed Students</p>
              <p className="text-2xl font-bold text-green-600">847</p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Process</p>
              <p className="text-2xl font-bold text-blue-600">312</p>
            </div>
            <FaClock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">88</p>
            </div>
            <FaTimesCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <FaUserGraduate className="text-white text-sm" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getCGPAColor(student.cgpa)}`}>
                      {student.cgpa}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{student.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                    {student.company && (
                      <div className="text-xs text-gray-500 mt-1">{student.company}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.applications} applied</div>
                    <div className="text-sm text-gray-500">{student.offers} offers</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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
    </div>
  );
};

export default StudentManagement;
