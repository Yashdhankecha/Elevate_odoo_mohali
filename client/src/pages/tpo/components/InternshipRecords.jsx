import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaTrash,
  FaBuilding,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaUserGraduate,
  FaCertificate
} from 'react-icons/fa';

const InternshipRecords = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDuration, setFilterDuration] = useState('All');

  const internships = [
    {
      id: 1,
      student: {
        name: 'Rahul Sharma',
        rollNo: '20CS001',
        department: 'Computer Science',
        cgpa: 8.7
      },
      company: {
        name: 'Google Inc.',
        logo: 'G',
        location: 'Mountain View, CA',
        website: 'google.com',
        contactPerson: 'John Smith',
        contactPhone: '+1-650-253-0000',
        contactEmail: 'internships@google.com'
      },
      position: 'Software Engineering Intern',
      startDate: 'May 15, 2024',
      endDate: 'Aug 15, 2024',
      duration: '3 months',
      status: 'Completed',
      stipend: '$8,000/month',
      performance: {
        rating: 4.8,
        feedback: 'Excellent problem-solving skills and strong technical knowledge',
        supervisor: 'Sarah Johnson',
        completion: true,
        ppo: true,
        ppoPackage: '₹18.5 LPA'
      },
      project: {
        title: 'Machine Learning Pipeline Optimization',
        description: 'Developed and optimized ML pipelines for data processing',
        technologies: ['Python', 'TensorFlow', 'Google Cloud', 'Docker'],
        impact: 'Reduced processing time by 40%'
      },
      skills: ['Machine Learning', 'Python', 'Cloud Computing', 'Data Engineering']
    },
    {
      id: 2,
      student: {
        name: 'Priya Patel',
        rollNo: '20EC024',
        department: 'Electronics',
        cgpa: 9.1
      },
      company: {
        name: 'Microsoft Corporation',
        logo: 'M',
        location: 'Redmond, WA',
        website: 'microsoft.com',
        contactPerson: 'Mike Davis',
        contactPhone: '+1-425-882-8080',
        contactEmail: 'interns@microsoft.com'
      },
      position: 'Data Science Intern',
      startDate: 'Jun 1, 2024',
      endDate: 'Sep 1, 2024',
      duration: '3 months',
      status: 'Completed',
      stipend: '$7,500/month',
      performance: {
        rating: 4.6,
        feedback: 'Great analytical skills and ability to work independently',
        supervisor: 'David Wilson',
        completion: true,
        ppo: true,
        ppoPackage: '₹16.2 LPA'
      },
      project: {
        title: 'Customer Behavior Analysis',
        description: 'Analyzed customer data to improve product recommendations',
        technologies: ['Python', 'SQL', 'Power BI', 'Azure ML'],
        impact: 'Improved recommendation accuracy by 25%'
      },
      skills: ['Data Analysis', 'Machine Learning', 'SQL', 'Business Intelligence']
    },
    {
      id: 3,
      student: {
        name: 'Arjun Kumar',
        rollNo: '20ME156',
        department: 'Mechanical',
        cgpa: 7.8
      },
      company: {
        name: 'Tata Motors',
        logo: 'T',
        location: 'Pune, India',
        website: 'tatamotors.com',
        contactPerson: 'Rajesh Verma',
        contactPhone: '+91-20-6601-1111',
        contactEmail: 'internships@tatamotors.com'
      },
      position: 'Mechanical Engineering Intern',
      startDate: 'Jul 1, 2024',
      endDate: 'Oct 1, 2024',
      duration: '3 months',
      status: 'Ongoing',
      stipend: '₹25,000/month',
      performance: {
        rating: 4.2,
        feedback: 'Good technical knowledge, needs improvement in communication',
        supervisor: 'Anil Kumar',
        completion: false,
        ppo: false,
        ppoPackage: null
      },
      project: {
        title: 'Engine Performance Optimization',
        description: 'Working on optimizing engine performance and fuel efficiency',
        technologies: ['AutoCAD', 'SolidWorks', 'MATLAB', 'CFD Analysis'],
        impact: 'In progress'
      },
      skills: ['AutoCAD', 'SolidWorks', 'Thermodynamics', 'Manufacturing']
    },
    {
      id: 4,
      student: {
        name: 'Sneha Reddy',
        rollNo: '20IT045',
        department: 'Information Technology',
        cgpa: 8.9
      },
      company: {
        name: 'Amazon Web Services',
        logo: 'A',
        location: 'Seattle, WA',
        website: 'aws.amazon.com',
        contactPerson: 'Lisa Chen',
        contactPhone: '+1-206-266-1000',
        contactEmail: 'aws-interns@amazon.com'
      },
      position: 'Cloud Solutions Intern',
      startDate: 'May 20, 2024',
      endDate: 'Aug 20, 2024',
      duration: '3 months',
      status: 'Completed',
      stipend: '$9,000/month',
      performance: {
        rating: 4.9,
        feedback: 'Outstanding performance, excellent cloud architecture skills',
        supervisor: 'Robert Brown',
        completion: true,
        ppo: true,
        ppoPackage: '₹20.1 LPA'
      },
      project: {
        title: 'Multi-Cloud Migration Strategy',
        description: 'Designed and implemented cloud migration strategies for enterprise clients',
        technologies: ['AWS', 'Terraform', 'Docker', 'Kubernetes'],
        impact: 'Successfully migrated 15+ applications to cloud'
      },
      skills: ['AWS', 'DevOps', 'Infrastructure as Code', 'Containerization']
    },
    {
      id: 5,
      student: {
        name: 'Vikram Singh',
        rollNo: '20CS078',
        department: 'Computer Science',
        cgpa: 7.5
      },
      company: {
        name: 'Infosys Limited',
        logo: 'I',
        location: 'Bangalore, India',
        website: 'infosys.com',
        contactPerson: 'Priya Sharma',
        contactPhone: '+91-80-2852-0261',
        contactEmail: 'interns@infosys.com'
      },
      position: 'Software Development Intern',
      startDate: 'Jun 15, 2024',
      endDate: 'Sep 15, 2024',
      duration: '3 months',
      status: 'Completed',
      stipend: '₹20,000/month',
      performance: {
        rating: 3.8,
        feedback: 'Good coding skills, needs improvement in team collaboration',
        supervisor: 'Suresh Kumar',
        completion: true,
        ppo: false,
        ppoPackage: null
      },
      project: {
        title: 'E-commerce Platform Development',
        description: 'Developed features for an e-commerce platform using Java Spring',
        technologies: ['Java', 'Spring Boot', 'MySQL', 'React'],
        impact: 'Implemented 5 new features for the platform'
      },
      skills: ['Java', 'Spring Boot', 'MySQL', 'Web Development']
    }
  ];

  const statuses = ['All', 'Ongoing', 'Completed', 'Upcoming', 'Cancelled'];
  const durations = ['All', '1 month', '2 months', '3 months', '6 months'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         internship.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         internship.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || internship.status === filterStatus;
    const matchesDuration = filterDuration === 'All' || internship.duration === filterDuration;
    
    return matchesSearch && matchesStatus && matchesDuration;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-pink-600" />
            Internship Records
          </h2>
          <p className="text-gray-600">Track student internships, performance, and PPO offers</p>
        </div>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus className="w-4 h-4" />
          Add Internship
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={filterDuration}
            onChange={(e) => setFilterDuration(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            {durations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
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
              <p className="text-sm text-gray-600">Total Internships</p>
              <p className="text-2xl font-bold text-gray-800">156</p>
            </div>
            <FaCalendarAlt className="w-8 h-8 text-pink-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ongoing</p>
              <p className="text-2xl font-bold text-green-600">23</p>
            </div>
            <FaClock className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">PPO Offers</p>
              <p className="text-2xl font-bold text-blue-600">89</p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">4.3</p>
            </div>
            <FaStar className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Internships Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student & Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInternships.map((internship) => (
                <tr key={internship.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{internship.company.logo}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{internship.student.name}</div>
                        <div className="text-sm text-gray-500">{internship.company.name}</div>
                        <div className="text-xs text-gray-400">{internship.student.rollNo} • {internship.student.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{internship.position}</div>
                      <div className="text-sm text-gray-500">
                        {internship.startDate} - {internship.endDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        Duration: {internship.duration} • Stipend: {internship.stipend}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <FaStar className={`w-4 h-4 ${getRatingColor(internship.performance.rating)}`} />
                        <span className={`text-sm font-medium ml-1 ${getRatingColor(internship.performance.rating)}`}>
                          {internship.performance.rating}/5
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Supervisor: {internship.performance.supervisor}
                      </div>
                      {internship.performance.ppo && (
                        <div className="text-sm text-green-600 font-medium">
                          PPO: {internship.performance.ppoPackage}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{internship.project.title}</div>
                      <div className="text-sm text-gray-500">{internship.project.impact}</div>
                      <div className="flex flex-wrap gap-1">
                        {internship.project.technologies.slice(0, 2).map((tech, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                            {tech}
                          </span>
                        ))}
                        {internship.project.technologies.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{internship.project.technologies.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(internship.status)}`}>
                      {internship.status}
                    </span>
                    {internship.performance.completion && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaCertificate className="w-3 h-3 mr-1" />
                          Completed
                        </span>
                      </div>
                    )}
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

export default InternshipRecords;
