import React, { useState } from 'react';
import { 
  FaChartBar, 
  FaDownload, 
  FaFilter, 
  FaCalendarAlt,
  FaUsers,
  FaBuilding,
  FaGraduationCap,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv
} from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedChart, setSelectedChart] = useState('placement');

  // Sample data for charts
  const placementData = [
    { name: 'Placed', value: 847, color: '#10B981' },
    { name: 'In Process', value: 312, color: '#3B82F6' },
    { name: 'Pending', value: 88, color: '#F59E0B' },
    { name: 'Not Placed', value: 100, color: '#EF4444' }
  ];

  const departmentData = [
    { department: 'Computer Science', placed: 287, total: 456, percentage: 89 },
    { department: 'Electronics', placed: 198, total: 324, percentage: 88 },
    { department: 'Information Tech', placed: 156, total: 278, percentage: 89 },
    { department: 'Mechanical', placed: 234, total: 412, percentage: 76 },
    { department: 'Civil', placed: 189, total: 356, percentage: 82 }
  ];

  const companyParticipationData = [
    { company: 'Google', hires: 23, rating: 4.8, visits: 2 },
    { company: 'Microsoft', hires: 18, rating: 4.6, visits: 2 },
    { company: 'Amazon', hires: 15, rating: 4.7, visits: 1 },
    { company: 'TCS', hires: 12, rating: 4.2, visits: 3 },
    { company: 'Infosys', hires: 8, rating: 4.0, visits: 2 },
    { company: 'Wipro', hires: 6, rating: 4.1, visits: 1 }
  ];

  const monthlyTrendsData = [
    { month: 'Jan', placements: 45, applications: 120, interviews: 78 },
    { month: 'Feb', placements: 52, applications: 135, interviews: 85 },
    { month: 'Mar', placements: 48, applications: 110, interviews: 72 },
    { month: 'Apr', placements: 61, applications: 145, interviews: 92 },
    { month: 'May', placements: 58, applications: 130, interviews: 88 },
    { month: 'Jun', placements: 67, applications: 155, interviews: 95 },
    { month: 'Jul', placements: 73, applications: 165, interviews: 102 },
    { month: 'Aug', placements: 69, applications: 150, interviews: 98 },
    { month: 'Sep', placements: 78, applications: 175, interviews: 108 },
    { month: 'Oct', placements: 82, applications: 185, interviews: 115 },
    { month: 'Nov', placements: 89, applications: 195, interviews: 122 },
    { month: 'Dec', placements: 95, applications: 210, interviews: 130 }
  ];

  const packageDistributionData = [
    { range: '0-5 LPA', students: 45, percentage: 5.3 },
    { range: '5-10 LPA', students: 234, percentage: 27.6 },
    { range: '10-15 LPA', students: 312, percentage: 36.8 },
    { range: '15-20 LPA', students: 156, percentage: 18.4 },
    { range: '20-25 LPA', students: 67, percentage: 7.9 },
    { range: '25+ LPA', students: 33, percentage: 3.9 }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={30} textAnchor="middle" fill={fill} className="text-sm">
          {value} students
        </text>
        <text x={cx} y={cy} dy={50} textAnchor="middle" fill={fill} className="text-xs">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaChartBar className="text-red-600" />
            Reports & Analytics
          </h2>
          <p className="text-gray-600">Comprehensive analytics and insights for placement performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaDownload className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Placements</p>
              <p className="text-2xl font-bold text-gray-800">847</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <FaArrowUp className="w-3 h-3" />
                +12% from last year
              </p>
            </div>
            <FaTrophy className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Package</p>
              <p className="text-2xl font-bold text-gray-800">₹8.5L</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <FaArrowUp className="w-3 h-3" />
                +8% from last year
              </p>
            </div>
            <FaGraduationCap className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Companies Visited</p>
              <p className="text-2xl font-bold text-gray-800">127</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <FaArrowUp className="w-3 h-3" />
                +15 from last year
              </p>
            </div>
            <FaBuilding className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Placement Rate</p>
              <p className="text-2xl font-bold text-gray-800">89.4%</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <FaArrowUp className="w-3 h-3" />
                +5% from last year
              </p>
            </div>
            <FaUsers className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedChart('placement')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedChart === 'placement' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Placement Overview
          </button>
          <button
            onClick={() => setSelectedChart('department')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedChart === 'department' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Department Performance
          </button>
          <button
            onClick={() => setSelectedChart('company')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedChart === 'company' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Company Participation
          </button>
          <button
            onClick={() => setSelectedChart('trends')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedChart === 'trends' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly Trends
          </button>
          <button
            onClick={() => setSelectedChart('package')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedChart === 'package' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Package Distribution
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedChart === 'placement' && 'Placement Status Distribution'}
            {selectedChart === 'department' && 'Department-wise Placement Performance'}
            {selectedChart === 'company' && 'Company-wise Hiring Statistics'}
            {selectedChart === 'trends' && 'Monthly Placement Trends'}
            {selectedChart === 'package' && 'Package Distribution'}
          </h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {selectedChart === 'placement' && (
                <PieChart>
                  <Pie
                    data={placementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    activeShape={renderActiveShape}
                  >
                    {placementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              )}
              
              {selectedChart === 'department' && (
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" fill="#EF4444" />
                </BarChart>
              )}
              
              {selectedChart === 'company' && (
                <BarChart data={companyParticipationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="company" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="hires" fill="#EF4444" />
                </BarChart>
              )}
              
              {selectedChart === 'trends' && (
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="placements" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="interviews" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              )}
              
              {selectedChart === 'package' && (
                <AreaChart data={packageDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="students" stroke="#EF4444" fill="#FEE2E2" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart/Stats */}
        <div className="space-y-6">
          {/* Department Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-800">{dept.department}</span>
                      <span className="text-sm text-gray-600">{dept.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {dept.placed} placed out of {dept.total} students
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Reports</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaFileExcel className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Placement Statistics</div>
                    <div className="text-sm text-gray-500">Complete placement data in Excel format</div>
                  </div>
                </div>
                <FaDownload className="w-4 h-4 text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaFilePdf className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Detailed Report</div>
                    <div className="text-sm text-gray-500">Comprehensive analysis in PDF format</div>
                  </div>
                </div>
                <FaDownload className="w-4 h-4 text-gray-400" />
              </button>
              
              <button className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaFileCsv className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Raw Data</div>
                    <div className="text-sm text-gray-500">Database export in CSV format</div>
                  </div>
                </div>
                <FaDownload className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
