import React, { useState } from 'react';
import { Briefcase, MapPin, Filter, CheckCircle, Clock, XCircle, Search } from 'lucide-react';

const jobsData = [
  {
    id: 1,
    company: 'Google',
    role: 'Software Engineer Intern',
    location: 'Mountain View, CA',
    salary: '₹15-20 LPA',
    status: 'Interview Scheduled',
    statusColor: 'bg-yellow-100 text-yellow-700',
    applied: '5 days ago',
  },
  {
    id: 2,
    company: 'Microsoft',
    role: 'Product Manager Intern',
    location: 'Redmond, WA',
    salary: '₹18-25 LPA',
    status: 'Test Completed',
    statusColor: 'bg-blue-100 text-blue-700',
    applied: '1 week ago',
  },
  {
    id: 3,
    company: 'Apple',
    role: 'iOS Developer Intern',
    location: 'Cupertino, CA',
    salary: '₹20-28 LPA',
    status: 'Offer Received',
    statusColor: 'bg-green-100 text-green-700',
    applied: '2 weeks ago',
  },
  {
    id: 4,
    company: 'Netflix',
    role: 'Backend Developer',
    location: 'Los Gatos, CA',
    salary: '₹22-30 LPA',
    status: 'Rejected',
    statusColor: 'bg-red-100 text-red-700',
    applied: '3 weeks ago',
  },
];

const statusIcons = {
  'Interview Scheduled': <Clock className="w-4 h-4 mr-1" />,
  'Test Completed': <CheckCircle className="w-4 h-4 mr-1" />,
  'Offer Received': <CheckCircle className="w-4 h-4 mr-1 text-green-500" />,
  'Rejected': <XCircle className="w-4 h-4 mr-1 text-red-500" />,
};

const JobApplications = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || job.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = ['All', ...Array.from(new Set(jobsData.map(j => j.status)))];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Job Applications</h1>
        <p className="text-gray-600 text-sm md:text-base">Track all your job applications, statuses, and offers in one place.</p>
      </div>
      {/* Filter/Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 items-center">
        <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search company or role..."
            className="bg-transparent outline-none flex-1 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center">
          <div className="text-xl font-bold text-blue-600">4</div>
          <div className="text-xs text-gray-500">Total Applications</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center">
          <div className="text-xl font-bold text-yellow-600">1</div>
          <div className="text-xs text-gray-500">Interview Scheduled</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
          <div className="text-xl font-bold text-green-600">1</div>
          <div className="text-xs text-gray-500">Offer Received</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center">
          <div className="text-xl font-bold text-red-600">1</div>
          <div className="text-xs text-gray-500">Rejected</div>
        </div>
      </div>
      {/* Job List */}
      <div className="flex flex-col gap-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No job applications found.</div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center gap-4 border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                  {job.company[0]}
                </div>
                <div>
                  <div className="font-semibold text-lg text-gray-900">{job.role}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {job.company}
                    <MapPin className="w-4 h-4 ml-2" /> {job.location}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2 min-w-[120px]">
                <div className="font-semibold text-blue-700">{job.salary}</div>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${job.statusColor}`}>
                  {statusIcons[job.status]}
                  {job.status}
                </span>
                <span className="text-xs text-gray-400">Applied {job.applied}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobApplications;
