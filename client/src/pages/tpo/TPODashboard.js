import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Award, 
  BarChart3,
  BookOpen,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Settings,
  Target,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart,
  Bar
} from 'recharts';

const TPODashboard = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-full py-8 px-2 md:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <OverviewCard />
        <StudentsManagementCard />
        <CompaniesManagementCard />
        <PlacementManagementCard />
        <AnalyticsCard />
        <ReportsCard />
      </div>
    </div>
  );
};

// Overview Card
const OverviewCard = () => {
  const stats = [
    { label: 'Total Students', value: '1,847', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Registered Companies', value: '89', change: '+18%', icon: Building2, color: 'bg-green-500' },
    { label: 'Active Job Postings', value: '156', change: '+25%', icon: Briefcase, color: 'bg-purple-500' },
    { label: 'Placements This Year', value: '542', change: '+15%', icon: Award, color: 'bg-orange-500' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-500" /> TPO Dashboard Overview
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
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
    </div>
  );
};

// Students Management Card
const StudentsManagementCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-6 h-6 text-green-500" /> Students Management
      </h2>
      <button className="bg-gradient-to-r from-green-600 to-green-400 text-white px-4 py-2 rounded-lg shadow hover:from-green-700 hover:to-green-500 transition text-sm font-medium flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Student
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {[
        { department: 'Computer Science', students: 456, avgCGPA: '8.2', placed: '89%' },
        { department: 'Information Technology', students: 324, avgCGPA: '8.0', placed: '85%' },
        { department: 'Electronics & Comm.', students: 278, avgCGPA: '7.8', placed: '78%' }
      ].map((dept, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition bg-gradient-to-br from-gray-50 to-white">
          <h3 className="font-semibold text-sm mb-2">{dept.department}</h3>
          <div className="text-sm text-gray-600 mb-1">{dept.students} students</div>
          <div className="text-xs text-gray-500 mb-2">Avg CGPA: {dept.avgCGPA}</div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-green-600">{dept.placed} placed</span>
            <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Companies Management Card
const CompaniesManagementCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Building2 className="w-6 h-6 text-purple-500" /> Companies Management
      </h2>
      <button className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-purple-500 transition text-sm font-medium flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Company
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {[
        { name: 'TechCorp Solutions', sector: 'Technology', jobs: 12, applications: 234, status: 'Active' },
        { name: 'DataFlow Analytics', sector: 'Analytics', jobs: 8, applications: 156, status: 'Active' },
        { name: 'InnovateTech', sector: 'Startup', jobs: 5, applications: 89, status: 'Pending' }
      ].map((company, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition bg-gradient-to-br from-gray-50 to-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm">{company.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              company.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {company.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{company.sector}</div>
          <div className="text-xs text-gray-500 mb-3">{company.jobs} jobs • {company.applications} applications</div>
          <div className="flex gap-2">
            <button className="flex-1 text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100">
              View Profile
            </button>
            <button className="flex-1 text-xs bg-gray-50 text-gray-600 py-1 rounded hover:bg-gray-100">
              Manage
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Placement Management Card
const PlacementManagementCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Award className="w-6 h-6 text-indigo-500" /> Placement Management
      </h2>
      <button className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-4 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-indigo-500 transition text-sm font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Schedule Drive
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="font-semibold mb-3">Upcoming Drives</h3>
        <div className="space-y-3">
          {[
            { company: 'TechCorp Solutions', date: 'Dec 20, 2024', type: 'On-Campus', roles: '3 roles' },
            { company: 'DataFlow Analytics', date: 'Dec 25, 2024', type: 'Virtual', roles: '2 roles' }
          ].map((drive, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-white rounded border">
              <div>
                <div className="font-medium text-sm">{drive.company}</div>
                <div className="text-xs text-gray-500">{drive.date} • {drive.type}</div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{drive.roles}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="font-semibold mb-3">Recent Placements</h3>
        <div className="space-y-3">
          {[
            { student: 'Priya Sharma', company: 'TechCorp', package: '₹12 LPA', date: '2 days ago' },
            { student: 'Arjun Patel', company: 'DataFlow', package: '₹10 LPA', date: '5 days ago' }
          ].map((placement, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-white rounded border">
              <div>
                <div className="font-medium text-sm">{placement.student}</div>
                <div className="text-xs text-gray-500">{placement.company} • {placement.date}</div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{placement.package}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Analytics Card
const AnalyticsCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-orange-500" /> Analytics & Reports
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="font-semibold mb-4">Key Metrics</h3>
        <div className="space-y-4">
          {[
            { metric: 'Overall Placement Rate', value: '87%', trend: '+5%' },
            { metric: 'Average Package', value: '₹8.5 LPA', trend: '+12%' },
            { metric: 'Highest Package', value: '₹45 LPA', trend: '+20%' },
            { metric: 'Companies Visited', value: '89', trend: '+18%' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">{item.metric}</div>
                <div className="text-lg font-bold">{item.value}</div>
              </div>
              <span className="text-green-600 text-sm font-medium">{item.trend}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="font-semibold mb-4">Department Performance</h3>
        <div className="space-y-3">
          {[
            { dept: 'Computer Science', percentage: 89, color: 'bg-blue-500' },
            { dept: 'Information Technology', percentage: 85, color: 'bg-green-500' },
            { dept: 'Electronics', percentage: 78, color: 'bg-purple-500' },
            { dept: 'Electrical', percentage: 72, color: 'bg-orange-500' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.dept}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                </div>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Reports Card
const ReportsCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-pink-500" /> Reports & Export
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'Student Database', description: 'Complete student information and academic records', action: 'Export CSV' },
        { title: 'Placement Report', description: 'Detailed placement statistics and company data', action: 'Generate PDF' },
        { title: 'Company Analytics', description: 'Company-wise hiring trends and feedback', action: 'Download Excel' }
      ].map((report, i) => (
        <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition bg-gradient-to-br from-gray-50 to-white">
          <h3 className="font-semibold text-sm mb-2">{report.title}</h3>
          <p className="text-xs text-gray-600 mb-4">{report.description}</p>
          <button className="w-full bg-blue-50 text-blue-600 py-2 rounded text-sm hover:bg-blue-100 transition flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            {report.action}
          </button>
        </div>
      ))}
    </div>

    <div className="mt-4 pt-4 border-t">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Last updated: 2 hours ago</span>
        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <Settings className="w-4 h-4" />
          Configure Reports
        </button>
      </div>
    </div>
  </div>
);

export default TPODashboard;
