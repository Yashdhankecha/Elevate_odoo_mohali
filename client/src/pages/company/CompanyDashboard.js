import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  CheckCircle, 
  Award, 
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  IndianRupee,
  Mail,
  Phone,
  Globe,
  Bell,
  Settings,
  Download,
  Upload,
  Send,
  BarChart3,
  Target,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell 
} from 'recharts';

const CompanyDashboard = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [filters, setFilters] = useState({
    department: 'all',
    cgpa: 'all',
    skills: 'all'
  });

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-full py-8 px-2 md:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <DashboardOverviewCard />
        <JobManagementCard setShowJobModal={setShowJobModal} />
        <ApplicationsTrackingCard filters={filters} setFilters={setFilters} />
        <InterviewSchedulingCard setShowInterviewModal={setShowInterviewModal} />
        <AnnouncementsCard />
        <CompanyProfileCard />
      </div>

      {/* Modals */}
      {showJobModal && <JobModal setShowJobModal={setShowJobModal} />}
      {showInterviewModal && <InterviewModal setShowInterviewModal={setShowInterviewModal} />}
    </div>
  );
};

// Dashboard Overview Card
const DashboardOverviewCard = () => {
  const dashboardStats = [
    { label: 'Total Jobs Posted', value: '23', change: '+15%', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Applications Received', value: '847', change: '+22%', icon: Users, color: 'bg-green-500' },
    { label: 'Shortlisted', value: '156', change: '+8%', icon: CheckCircle, color: 'bg-purple-500' },
    { label: 'Offers Released', value: '47', change: '+12%', icon: Award, color: 'bg-orange-500' }
  ];

  const applicationTrends = [
    { month: 'Jan', applications: 120 },
    { month: 'Feb', applications: 135 },
    { month: 'Mar', applications: 148 },
    { month: 'Apr', applications: 162 },
    { month: 'May', applications: 178 },
    { month: 'Jun', applications: 195 }
  ];

  const statusDistribution = [
    { name: 'Applied', value: 60, color: '#3B82F6' },
    { name: 'Shortlisted', value: 25, color: '#10B981' },
    { name: 'Interview', value: 15, color: '#F59E0B' },
    { name: 'Offered', value: 10, color: '#8B5CF6' },
    { name: 'Rejected', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-500" /> Dashboard Overview
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="border rounded-xl p-4 flex flex-col hover:shadow-lg transition bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-green-600 text-xs font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={applicationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Job Management Card
const JobManagementCard = ({ setShowJobModal }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-green-500" /> Job Management
      </h2>
      <button 
        onClick={() => setShowJobModal(true)}
        className="bg-gradient-to-r from-green-600 to-green-400 text-white px-4 py-2 rounded-lg shadow hover:from-green-700 hover:to-green-500 transition text-sm font-medium flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Post New Job
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {[
        { title: 'Software Engineer Intern', applications: 89, deadline: '15 Dec 2024', status: 'Active' },
        { title: 'Data Analyst', applications: 67, deadline: '20 Dec 2024', status: 'Active' },
        { title: 'Product Manager Trainee', applications: 45, deadline: '25 Dec 2024', status: 'Draft' }
      ].map((job, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm">{job.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {job.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2">{job.applications} applications</div>
          <div className="text-xs text-gray-500 mb-3">Deadline: {job.deadline}</div>
          <div className="flex gap-2">
            <button className="flex-1 text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100">
              View
            </button>
            <button className="flex-1 text-xs bg-gray-50 text-gray-600 py-1 rounded hover:bg-gray-100">
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Applications Tracking Card
const ApplicationsTrackingCard = ({ filters, setFilters }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-6 h-6 text-purple-500" /> Applications Tracking
      </h2>
      <div className="flex gap-2">
        <button className="flex items-center gap-1 border px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-purple-500 transition text-sm font-medium">
          Bulk Actions
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {[
        { name: 'Priya Sharma', role: 'Software Engineer', cgpa: '8.9', status: 'Shortlisted', department: 'CSE' },
        { name: 'Arjun Patel', role: 'Data Analyst', cgpa: '8.7', status: 'Interview', department: 'IT' },
        { name: 'Kavya Reddy', role: 'Product Manager', cgpa: '9.1', status: 'Applied', department: 'ECE' }
      ].map((applicant, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm">{applicant.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              applicant.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
              applicant.status === 'Interview' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {applicant.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{applicant.role}</div>
          <div className="text-xs text-gray-500 mb-1">{applicant.department} • CGPA: {applicant.cgpa}</div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100">
              View Profile
            </button>
            <button className="flex-1 text-xs bg-green-50 text-green-600 py-1 rounded hover:bg-green-100">
              Shortlist
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Interview Scheduling Card
const InterviewSchedulingCard = ({ setShowInterviewModal }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Calendar className="w-6 h-6 text-indigo-500" /> Interview Scheduling
      </h2>
      <button 
        onClick={() => setShowInterviewModal(true)}
        className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-4 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-indigo-500 transition text-sm font-medium flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Schedule Interview
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { candidate: 'Priya Sharma', role: 'Software Engineer', date: 'Dec 18, 2024', time: '10:00 AM', type: 'Technical' },
        { candidate: 'Arjun Patel', role: 'Data Analyst', date: 'Dec 19, 2024', time: '2:00 PM', type: 'HR Round' }
      ].map((interview, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm">{interview.candidate}</h3>
            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              {interview.type}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{interview.role}</div>
          <div className="text-xs text-gray-500 mb-3">
            <Clock className="w-3 h-3 inline mr-1" />
            {interview.date} at {interview.time}
          </div>
          <div className="flex gap-2">
            <button className="flex-1 text-xs bg-green-50 text-green-600 py-1 rounded hover:bg-green-100">
              Join Meeting
            </button>
            <button className="flex-1 text-xs bg-gray-50 text-gray-600 py-1 rounded hover:bg-gray-100">
              Reschedule
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Announcements Card
const AnnouncementsCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-orange-500" /> Announcements
      </h2>
      <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-4 py-2 rounded-lg shadow hover:from-orange-700 hover:to-orange-500 transition text-sm font-medium flex items-center gap-2">
        <Plus className="w-4 h-4" /> New Announcement
      </button>
    </div>

    <div className="space-y-4">
      {[
        { title: 'Interview Updates', message: 'Technical interviews scheduled for next week', time: '2 hours ago', priority: 'high' },
        { title: 'Application Deadline', message: 'Reminder: Applications close on Dec 25th', time: '1 day ago', priority: 'medium' },
        { title: 'Campus Visit', message: 'Campus recruitment drive planned for January', time: '3 days ago', priority: 'low' }
      ].map((announcement, i) => (
        <div key={i} className="border rounded-lg p-4 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm">{announcement.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
              announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {announcement.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
          <div className="text-xs text-gray-500">{announcement.time}</div>
        </div>
      ))}
    </div>
  </div>
);

// Company Profile Card
const CompanyProfileCard = () => {
  const companyInfo = {
    name: "TechCorp Solutions",
    logo: "🏢",
    about: "Leading technology company specializing in AI and Machine Learning solutions",
    website: "www.techcorp.com",
    email: "hr@techcorp.com",
    phone: "+91 9876543210",
    industry: "Information Technology",
    size: "500-1000 employees"
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-pink-500" /> Company Profile
        </h2>
        <button className="flex items-center gap-1 border px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition">
          <Edit className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-xl">
              {companyInfo.logo}
            </div>
            <div>
              <h3 className="font-semibold">{companyInfo.name}</h3>
              <p className="text-sm text-gray-600">{companyInfo.industry}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{companyInfo.about}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Website:</span>
              <p className="font-medium">{companyInfo.website}</p>
            </div>
            <div>
              <span className="text-gray-500">Size:</span>
              <p className="font-medium">{companyInfo.size}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <h4 className="font-medium mb-2">Quick Actions</h4>
          </div>
          <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border">
            <Upload className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Upload Logo</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border">
            <Download className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Download Reports</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Job Modal Component
const JobModal = ({ setShowJobModal }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Post New Job</h2>
        <button 
          onClick={() => setShowJobModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="Software Engineer Intern" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select className="w-full p-2 border rounded-lg">
              <option>Engineering</option>
              <option>Data Science</option>
              <option>Product</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Salary Range</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="₹8-12 LPA" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="Bangalore, India" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <textarea className="w-full p-2 border rounded-lg h-24" placeholder="Job requirements and responsibilities..."></textarea>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Post Job
          </button>
          <button
            type="button"
            onClick={() => setShowJobModal(false)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Interview Modal Component  
const InterviewModal = ({ setShowInterviewModal }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Schedule Interview</h2>
        <button 
          onClick={() => setShowInterviewModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Candidate</label>
          <select className="w-full p-2 border rounded-lg">
            <option>Priya Sharma</option>
            <option>Arjun Patel</option>
            <option>Kavya Reddy</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input type="time" className="w-full p-2 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Interview Type</label>
          <select className="w-full p-2 border rounded-lg">
            <option>Technical Round</option>
            <option>HR Round</option>
            <option>Managerial Round</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            Schedule Interview
          </button>
          <button
            type="button"
            onClick={() => setShowInterviewModal(false)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default CompanyDashboard;