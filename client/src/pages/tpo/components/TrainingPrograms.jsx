import React, { useState } from 'react';
import { 
  FaGraduationCap, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaPlay,
  FaPause,
  FaStop,
  FaCertificate,
  FaBook,
  FaChalkboardTeacher
} from 'react-icons/fa';

const TrainingPrograms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const programs = [
    {
      id: 1,
      name: 'Advanced Data Structures & Algorithms',
      instructor: 'Dr. Rajesh Kumar',
      type: 'Technical',
      status: 'Ongoing',
      startDate: 'Dec 1, 2024',
      endDate: 'Dec 15, 2024',
      duration: '2 weeks',
      schedule: 'Mon, Wed, Fri • 2:00 PM - 4:00 PM',
      location: 'Computer Lab 1',
      maxStudents: 50,
      enrolledStudents: 45,
      completedStudents: 0,
      topics: ['Dynamic Programming', 'Graph Algorithms', 'Advanced Trees', 'System Design'],
      skills: ['Problem Solving', 'Algorithm Design', 'Data Structures'],
      certificate: true,
      fee: '₹5,000',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Full Stack Web Development',
      instructor: 'Prof. Priya Sharma',
      type: 'Technical',
      status: 'Upcoming',
      startDate: 'Jan 5, 2025',
      endDate: 'Feb 5, 2025',
      duration: '4 weeks',
      schedule: 'Tue, Thu, Sat • 10:00 AM - 12:00 PM',
      location: 'Online Platform',
      maxStudents: 40,
      enrolledStudents: 38,
      completedStudents: 0,
      topics: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Deployment'],
      skills: ['Frontend Development', 'Backend Development', 'Database Design'],
      certificate: true,
      fee: '₹8,000',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Machine Learning Fundamentals',
      instructor: 'Dr. Amit Patel',
      type: 'Technical',
      status: 'Completed',
      startDate: 'Nov 1, 2024',
      endDate: 'Nov 30, 2024',
      duration: '4 weeks',
      schedule: 'Mon, Wed, Fri • 3:00 PM - 5:00 PM',
      location: 'AI Lab',
      maxStudents: 35,
      enrolledStudents: 35,
      completedStudents: 32,
      topics: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Deep Learning'],
      skills: ['Python', 'Scikit-learn', 'TensorFlow', 'Data Analysis'],
      certificate: true,
      fee: '₹10,000',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Soft Skills & Communication',
      instructor: 'Ms. Sneha Reddy',
      type: 'Soft Skills',
      status: 'Ongoing',
      startDate: 'Dec 10, 2024',
      endDate: 'Dec 25, 2024',
      duration: '2 weeks',
      schedule: 'Tue, Thu • 4:00 PM - 6:00 PM',
      location: 'Seminar Hall 2',
      maxStudents: 60,
      enrolledStudents: 52,
      completedStudents: 0,
      topics: ['Public Speaking', 'Interview Skills', 'Team Leadership', 'Conflict Resolution'],
      skills: ['Communication', 'Leadership', 'Presentation Skills'],
      certificate: true,
      fee: '₹3,000',
      rating: 4.5
    },
    {
      id: 5,
      name: 'AWS Cloud Computing',
      instructor: 'Mr. Vikram Singh',
      type: 'Certification',
      status: 'Upcoming',
      startDate: 'Jan 15, 2025',
      endDate: 'Mar 15, 2025',
      duration: '8 weeks',
      schedule: 'Sat, Sun • 9:00 AM - 11:00 AM',
      location: 'Cloud Lab',
      maxStudents: 30,
      enrolledStudents: 25,
      completedStudents: 0,
      topics: ['EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation'],
      skills: ['AWS Services', 'Cloud Architecture', 'DevOps'],
      certificate: true,
      fee: '₹15,000',
      rating: 4.7
    }
  ];

  const statuses = ['All', 'Ongoing', 'Upcoming', 'Completed', 'Cancelled'];
  const types = ['All', 'Technical', 'Soft Skills', 'Certification', 'Workshop'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Technical': return 'bg-purple-100 text-purple-800';
      case 'Soft Skills': return 'bg-pink-100 text-pink-800';
      case 'Certification': return 'bg-indigo-100 text-indigo-800';
      case 'Workshop': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (enrolled, max) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || program.status === filterStatus;
    const matchesType = filterType === 'All' || program.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaGraduationCap className="text-indigo-600" />
            Training Programs
          </h2>
          <p className="text-gray-600">Manage ongoing and upcoming training sessions, student enrollment</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
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
              <p className="text-sm text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-800">15</p>
            </div>
            <FaGraduationCap className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ongoing</p>
              <p className="text-2xl font-bold text-green-600">6</p>
            </div>
            <FaPlay className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">4</p>
            </div>
            <FaClock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-purple-600">342</p>
            </div>
            <FaUsers className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrograms.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{program.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaChalkboardTeacher className="w-4 h-4 mr-1" />
                  {program.instructor}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(program.type)}`}>
                    {program.type}
                  </span>
                  {program.certificate && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FaCertificate className="w-3 h-3 mr-1" />
                      Certificate
                    </span>
                  )}
                </div>
              </div>
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
            </div>

            {/* Schedule & Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  {program.startDate} - {program.endDate}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaClock className="w-4 h-4 mr-2" />
                  {program.schedule}
                </div>
                <div className="text-sm text-gray-600">
                  Duration: {program.duration}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Fee:</span> {program.fee}
                </div>
                <div className="flex items-center text-sm">
                  <FaBook className="w-4 h-4 mr-2 text-gray-600" />
                  {program.topics.length} topics
                </div>
                <div className="flex items-center text-sm">
                  <FaCertificate className="w-4 h-4 mr-2 text-gray-600" />
                  Rating: {program.rating}/5
                </div>
              </div>
            </div>

            {/* Enrollment Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Enrollment Progress</span>
                <span className="font-medium">{program.enrolledStudents}/{program.maxStudents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(program.enrolledStudents, program.maxStudents)}`}
                  style={{ width: `${(program.enrolledStudents / program.maxStudents) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Skills Covered:</h4>
              <div className="flex flex-wrap gap-1">
                {program.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {skill}
                  </span>
                ))}
                {program.skills.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{program.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {program.completedStudents > 0 && (
                  <span>{program.completedStudents} students completed</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                  View Details
                </button>
                <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  Manage Students
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPrograms;
