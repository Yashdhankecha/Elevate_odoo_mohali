import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, 
  FaDownload, 
  FaFileExcel, 
  FaFilePdf, 
  FaFileCsv,
  FaSync,
  FaSearch,
  FaUsers,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
  FaBuilding
} from 'react-icons/fa';
import { usePDF } from 'react-to-pdf';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [exporting, setExporting] = useState({ pdf: false, excel: false, csv: false });
  const [loading, setLoading] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: `Company_Reports_Analytics_${new Date().toISOString().split('T')[0]}.pdf` });
  
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      shortlistedCandidates: 0,
      hiredCandidates: 0,
      averageResponseTime: 0,
      topPerformingJob: '',
      mostAppliedJob: ''
    },
    jobStats: [],
    applicationStats: [],
    candidateStats: [],
    monthlyTrends: [],
    recentHires: [],
    upcomingInterviews: []
  });

  const periods = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'current_month', label: 'Current Month' }
  ];

  const jobTypes = [
    { value: 'all', label: 'All Job Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' }
  ];

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchAnalyticsData();
      }
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedPeriod, selectedJobType, searchTerm, autoRefresh]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Generate dynamic data based on filters
      const dynamicData = generateDynamicData();
      setAnalyticsData(dynamicData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const generateDynamicData = () => {
    const baseMultiplier = selectedPeriod === 'current_month' ? 0.1 : 
                          selectedPeriod === 'last_3_months' ? 0.3 :
                          selectedPeriod === 'last_6_months' ? 0.6 :
                          selectedPeriod === '2022' ? 0.5 :
                          selectedPeriod === '2023' ? 0.8 : 1;

    const jobTypeFilter = selectedJobType !== 'all' ? selectedJobType : null;

    // Generate job statistics
    const jobTitles = [
      'Software Engineer', 'Data Analyst', 'Product Manager', 'UX Designer', 
      'DevOps Engineer', 'QA Engineer', 'Frontend Developer', 'Backend Developer',
      'Mobile Developer', 'Data Scientist', 'Business Analyst', 'Project Manager'
    ];

    const jobStats = jobTitles.map(title => {
      const applications = Math.floor(Math.random() * 200) + 20;
      const shortlisted = Math.floor(applications * (0.1 + Math.random() * 0.2));
      const hired = Math.floor(shortlisted * (0.3 + Math.random() * 0.4));
      
      return {
        title,
        type: ['full-time', 'part-time', 'internship', 'contract'][Math.floor(Math.random() * 4)],
        applications: Math.floor(applications * baseMultiplier),
        shortlisted: Math.floor(shortlisted * baseMultiplier),
        hired: Math.floor(hired * baseMultiplier),
        status: Math.random() > 0.3 ? 'Active' : 'Closed',
        postedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        salary: Math.floor((50000 + Math.random() * 100000) * baseMultiplier)
      };
    });

    // Filter by job type if specified
    const filteredJobStats = jobTypeFilter 
      ? jobStats.filter(job => job.type === jobTypeFilter)
      : jobStats;

    // Generate application statistics
    const applicationStats = filteredJobStats.map(job => ({
      jobTitle: job.title,
      totalApplications: job.applications,
      shortlisted: job.shortlisted,
      hired: job.hired,
      conversionRate: Math.round((job.hired / job.applications) * 100 * 10) / 10,
      avgResponseTime: Math.floor(Math.random() * 7) + 1
    }));

    // Generate candidate statistics
    const candidateStats = [
      { category: 'Fresh Graduates', count: Math.floor(Math.random() * 100 + 50) * baseMultiplier, percentage: 35 },
      { category: '1-3 Years Experience', count: Math.floor(Math.random() * 150 + 100) * baseMultiplier, percentage: 45 },
      { category: '3-5 Years Experience', count: Math.floor(Math.random() * 80 + 40) * baseMultiplier, percentage: 15 },
      { category: '5+ Years Experience', count: Math.floor(Math.random() * 50 + 20) * baseMultiplier, percentage: 5 }
    ];

    // Generate monthly trends
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = months.map(month => ({
      month,
      applications: Math.floor(Math.random() * 500 + 200) * baseMultiplier,
      interviews: Math.floor(Math.random() * 100 + 50) * baseMultiplier,
      hires: Math.floor(Math.random() * 30 + 10) * baseMultiplier,
      avgResponseTime: Math.floor(Math.random() * 5) + 1
    }));

    // Generate recent hires
    const candidates = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Brown', 'Emily Davis', 'David Lee', 'Lisa Chen'];
    const recentHires = Array.from({ length: Math.floor(8 * baseMultiplier) }, (_, i) => ({
      id: i + 1,
      candidate: candidates[Math.floor(Math.random() * candidates.length)],
      position: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      department: ['Engineering', 'Design', 'Product', 'Data', 'Marketing'][Math.floor(Math.random() * 5)],
      hireDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      salary: Math.floor((50000 + Math.random() * 100000) * baseMultiplier)
    }));

    // Generate upcoming interviews
    const upcomingInterviews = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      candidate: candidates[Math.floor(Math.random() * candidates.length)],
      position: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 12) + 9}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      type: Math.random() > 0.5 ? 'Technical' : 'HR',
      status: Math.random() > 0.3 ? 'Scheduled' : 'Pending'
    }));

    // Calculate overview stats
    const totalJobs = filteredJobStats.length;
    const activeJobs = filteredJobStats.filter(job => job.status === 'Active').length;
    const totalApplications = filteredJobStats.reduce((sum, job) => sum + job.applications, 0);
    const shortlistedCandidates = filteredJobStats.reduce((sum, job) => sum + job.shortlisted, 0);
    const hiredCandidates = filteredJobStats.reduce((sum, job) => sum + job.hired, 0);
    const avgResponseTime = Math.floor(applicationStats.reduce((sum, app) => sum + app.avgResponseTime, 0) / applicationStats.length);

    // Find top performers
    const topPerformingJob = filteredJobStats.reduce((top, current) => 
      (current.hired / current.applications) > (top.hired / top.applications) ? current : top, filteredJobStats[0]);
    const mostAppliedJob = filteredJobStats.reduce((top, current) => 
      current.applications > top.applications ? current : top, filteredJobStats[0]);

    return {
      overview: {
        totalJobs,
        activeJobs,
        totalApplications,
        shortlistedCandidates,
        hiredCandidates,
        averageResponseTime: avgResponseTime,
        topPerformingJob: topPerformingJob?.title || 'N/A',
        mostAppliedJob: mostAppliedJob?.title || 'N/A'
      },
      jobStats: filteredJobStats,
      applicationStats,
      candidateStats,
      monthlyTrends,
      recentHires,
      upcomingInterviews
    };
  };

  const formatNumber = (value) => {
    return value.toLocaleString();
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    if (salary >= 100000) {
      return `$${(salary / 100000).toFixed(1)}K`;
    } else if (salary >= 1000) {
      return `$${(salary / 1000).toFixed(1)}K`;
    }
    return `$${salary}`;
  };

  const exportReport = async (format) => {
    if (exporting.pdf || exporting.excel || exporting.csv) {
      return;
    }

    setExporting(prev => ({ ...prev, [format]: true }));
    
    try {
      if (format === 'pdf') {
        await exportToPDF();
      } else if (format === 'excel') {
        await exportToExcel();
      } else if (format === 'csv') {
        await exportToCSV();
      }
    } finally {
      setExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  const exportToPDF = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toPDF();
      await new Promise(resolve => setTimeout(resolve, 200));
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const exportToExcel = async () => {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Overview data
      const overviewData = [
        ['Metric', 'Value'],
        ['Total Jobs', analyticsData.overview.totalJobs],
        ['Active Jobs', analyticsData.overview.activeJobs],
        ['Total Applications', analyticsData.overview.totalApplications],
        ['Shortlisted Candidates', analyticsData.overview.shortlistedCandidates],
        ['Hired Candidates', analyticsData.overview.hiredCandidates],
        ['Average Response Time (days)', analyticsData.overview.averageResponseTime],
        ['Top Performing Job', analyticsData.overview.topPerformingJob],
        ['Most Applied Job', analyticsData.overview.mostAppliedJob]
      ];
      
      const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');
      
      // Job statistics
      const jobData = [
        ['Job Title', 'Type', 'Applications', 'Shortlisted', 'Hired', 'Status', 'Posted Date', 'Salary']
      ];
      
      analyticsData.jobStats.forEach(job => {
        jobData.push([
          job.title,
          job.type,
          job.applications,
          job.shortlisted,
          job.hired,
          job.status,
          job.postedDate,
          formatSalary(job.salary)
        ]);
      });
      
      const jobSheet = XLSX.utils.aoa_to_sheet(jobData);
      XLSX.utils.book_append_sheet(workbook, jobSheet, 'Job Statistics');
      
      // Recent hires
      if (analyticsData.recentHires.length > 0) {
        const hiresData = [
          ['Candidate', 'Position', 'Department', 'Hire Date', 'Salary']
        ];
        
        analyticsData.recentHires.forEach(hire => {
          hiresData.push([
            hire.candidate,
            hire.position,
            hire.department,
            hire.hireDate,
            formatSalary(hire.salary)
          ]);
        });
        
        const hiresSheet = XLSX.utils.aoa_to_sheet(hiresData);
        XLSX.utils.book_append_sheet(workbook, hiresSheet, 'Recent Hires');
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const fileName = `Company_Reports_Analytics_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      toast.success('Excel file exported successfully!');
      
    } catch (error) {
      console.error('Error generating Excel file:', error);
      toast.error('Failed to generate Excel file. Please try again.');
    }
  };

  const exportToCSV = async () => {
    try {
      const csvData = [
        ['Job Title', 'Applications', 'Shortlisted', 'Hired', 'Conversion Rate'],
        ...analyticsData.applicationStats.map(stat => [
          stat.jobTitle,
          stat.totalApplications,
          stat.shortlisted,
          stat.hired,
          `${stat.conversionRate}%`
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Company_Reports_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      toast.success('CSV file exported successfully!');
      
    } catch (error) {
      console.error('Error generating CSV file:', error);
      toast.error('Failed to generate CSV file. Please try again.');
    }
  };

  const filteredData = {
    jobStats: analyticsData.jobStats.filter(job => 
      !searchTerm || job.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    applicationStats: analyticsData.applicationStats.filter(stat => 
      !searchTerm || stat.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  return (
    <div className="space-y-6">
      {/* PDF Export Target - Hidden */}
      <div ref={targetRef} className="absolute left-[-9999px] top-0 w-[800px] bg-white">
        <div className="p-8 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="text-center mb-8">
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              Company Recruitment Analytics
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
              Overview Statistics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ border: '1px solid #d1d5db', padding: '16px', borderRadius: '4px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Jobs</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{analyticsData.overview.totalJobs}</p>
              </div>
              <div style={{ border: '1px solid #d1d5db', padding: '16px', borderRadius: '4px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Applications</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{formatNumber(analyticsData.overview.totalApplications)}</p>
              </div>
              <div style={{ border: '1px solid #d1d5db', padding: '16px', borderRadius: '4px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Hired Candidates</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{analyticsData.overview.hiredCandidates}</p>
              </div>
              <div style={{ border: '1px solid #d1d5db', padding: '16px', borderRadius: '4px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Avg Response Time</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{analyticsData.overview.averageResponseTime} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view recruitment reports</p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {new Date().toLocaleString()}
            {autoRefresh && <span className="ml-2 text-blue-600">• Auto-refresh enabled</span>}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAnalyticsData}
              disabled={loading}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Refresh Data"
            >
                              <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span>Auto-refresh</span>
            </label>
            <button 
              onClick={() => exportReport('excel')}
              disabled={exporting.excel}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                exporting.excel 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              <FaFileExcel className="w-4 h-4" />
              <span>{exporting.excel ? 'Exporting...' : 'Export Excel'}</span>
            </button>
            <button 
              onClick={() => exportReport('pdf')}
              disabled={exporting.pdf}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                exporting.pdf 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              <FaFilePdf className="w-4 h-4" />
              <span>{exporting.pdf ? 'Exporting...' : 'Export PDF'}</span>
            </button>
            <button 
              onClick={() => exportReport('csv')}
              disabled={exporting.csv}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                exporting.csv 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <FaFileCsv className="w-4 h-4" />
              <span>{exporting.csv ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 text-right">
            Exports include: Overview stats, Job statistics, Application data, and Recent hires
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job titles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalJobs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBriefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">{analyticsData.overview.activeJobs}</span>
              <span className="text-gray-500 ml-1">active jobs</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.overview.totalApplications)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-blue-600 font-medium">{analyticsData.overview.shortlistedCandidates}</span>
              <span className="text-gray-500 ml-1">shortlisted</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hired Candidates</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.hiredCandidates}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {analyticsData.overview.totalApplications > 0 
                  ? Math.round((analyticsData.overview.hiredCandidates / analyticsData.overview.totalApplications) * 100 * 10) / 10
                  : 0}%
              </span>
              <span className="text-gray-500 ml-1">success rate</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.averageResponseTime} days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaClock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">Fast</span>
              <span className="text-gray-500 ml-1">response time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Job Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Job Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Applications</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Shortlisted</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Hired</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Posted Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.jobStats.slice(0, 10).map((job, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800 font-medium">{job.title}</td>
                  <td className="py-3 px-4 text-gray-600 capitalize">{job.type}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{job.applications}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{job.shortlisted}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{job.hired}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{job.postedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Hires */}
      {analyticsData.recentHires.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Hires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.recentHires.slice(0, 6).map((hire, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{hire.candidate}</h4>
                  <span className="text-sm text-gray-500">{hire.hireDate}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Position:</span> {hire.position}</p>
                  <p><span className="font-medium">Department:</span> {hire.department}</p>
                  <p><span className="font-medium">Salary:</span> {formatSalary(hire.salary)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Interviews */}
      {analyticsData.upcomingInterviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Interviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.upcomingInterviews.map((interview, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{interview.candidate}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    interview.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Position:</span> {interview.position}</p>
                  <p><span className="font-medium">Date:</span> {interview.date}</p>
                  <p><span className="font-medium">Time:</span> {interview.time}</p>
                  <p><span className="font-medium">Type:</span> {interview.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
