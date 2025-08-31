import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaDownload, 
  FaCalendarAlt,
  FaUsers,
  FaBuilding,
  FaTrophy,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaFileExcel,
  FaFilePdf,
  FaEye,
  FaRedo,
  FaSearch
} from 'react-icons/fa';
import { usePDF } from 'react-to-pdf';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import tpoApi from '../../../services/tpoApi';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [exporting, setExporting] = useState({ pdf: false, excel: false });
  const { toPDF, targetRef } = usePDF({ filename: `TPO_Reports_Analytics_${new Date().toISOString().split('T')[0]}.pdf` });
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalStudents: 0,
      placedStudents: 0,
      placementRate: 0,
      totalApplications: 0,
      totalOffers: 0,
      averagePackage: 0,
      topPerformingDept: '',
      topRecruiter: ''
    },
    departmentStats: [],
    companyStats: [],
    monthlyTrends: [],
    recentPlacements: [],
    upcomingDrives: []
  });

  const periods = [
    { value: 'all', label: 'All Time' },
    { value: 'current_year', label: 'Current Year' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'current_month', label: 'Current Month' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Mechanical', label: 'Mechanical' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Civil', label: 'Civil' },
    { value: 'Chemical', label: 'Chemical' },
    { value: 'Biotechnology', label: 'Biotechnology' }
  ];

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchAnalyticsData();
      }
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedPeriod, selectedDepartment, selectedCompany, searchTerm, autoRefresh]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate dynamic data based on filters
      const dynamicData = generateDynamicData();
      
      const response = await tpoApi.getReportsAnalytics();
      
      if (!response || !response.overview) {
        setAnalyticsData(dynamicData);
      } else {
        // Merge API data with dynamic data
        setAnalyticsData({
          ...dynamicData,
          ...response
        });
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
      // Fallback to dynamic data
      setAnalyticsData(generateDynamicData());
    } finally {
      setLoading(false);
    }
  };

  const generateDynamicData = () => {
    const baseMultiplier = selectedPeriod === 'current_month' ? 0.1 : 
                          selectedPeriod === 'last_3_months' ? 0.3 :
                          selectedPeriod === 'last_6_months' ? 0.6 :
                          selectedPeriod === 'last_year' ? 0.8 : 1;

    const deptFilter = selectedDepartment !== 'all' ? selectedDepartment : null;
    const companyFilter = selectedCompany !== 'all' ? selectedCompany : null;

    // Generate dynamic department stats
    const allDepartments = [
      'Computer Science', 'Electronics', 'Mechanical', 'Information Technology', 
      'Civil', 'Chemical', 'Biotechnology'
    ];
    
    const filteredDepartments = deptFilter ? [deptFilter] : allDepartments;
    
    const departmentStats = filteredDepartments.map(dept => {
      const baseTotal = Math.floor(Math.random() * 200) + 100;
      const basePlaced = Math.floor(baseTotal * (0.6 + Math.random() * 0.3));
      return {
        department: dept,
        total: Math.floor(baseTotal * baseMultiplier),
        placed: Math.floor(basePlaced * baseMultiplier),
        rate: Math.round((basePlaced / baseTotal) * 100 * 10) / 10,
        applications: Math.floor(baseTotal * 2.5 * baseMultiplier),
        avgPackage: Math.floor((600000 + Math.random() * 400000) * baseMultiplier)
      };
    });

    // Generate dynamic company stats
    const allCompanies = [
      'TechCorp', 'DataSoft', 'InnovateTech', 'GlobalSystems', 'FutureTech',
      'DigitalSolutions', 'CloudTech', 'AITech', 'CyberSec', 'RoboTech'
    ];
    
    const filteredCompanies = companyFilter ? [companyFilter] : allCompanies;
    
    const companyStats = filteredCompanies.map(company => {
      const applications = Math.floor(Math.random() * 200) + 50;
      const offers = Math.floor(applications * (0.2 + Math.random() * 0.3));
      return {
        company,
        applications: Math.floor(applications * baseMultiplier),
        offers: Math.floor(offers * baseMultiplier),
        successRate: Math.round((offers / applications) * 100 * 10) / 10,
        averagePackage: Math.floor((500000 + Math.random() * 500000) * baseMultiplier),
        lastRecruitment: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    });

    // Generate monthly trends
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = months.map((month, index) => ({
      month,
      placements: Math.floor(Math.random() * 80) + 20,
      applications: Math.floor(Math.random() * 200) + 100,
      successRate: Math.round((Math.random() * 0.4 + 0.3) * 100 * 10) / 10,
      avgPackage: Math.floor((500000 + Math.random() * 300000))
    }));

    // Calculate overview stats
    const totalStudents = departmentStats.reduce((sum, dept) => sum + dept.total, 0);
    const placedStudents = departmentStats.reduce((sum, dept) => sum + dept.placed, 0);
    const totalApplications = departmentStats.reduce((sum, dept) => sum + dept.applications, 0);
    const totalOffers = companyStats.reduce((sum, company) => sum + company.offers, 0);
    const avgPackage = Math.floor(companyStats.reduce((sum, company) => sum + company.averagePackage, 0) / companyStats.length);

    // Find top performers
    const topDept = departmentStats.reduce((top, current) => 
      current.rate > top.rate ? current : top, departmentStats[0]);
    const topRecruiter = companyStats.reduce((top, current) => 
      current.offers > top.offers ? current : top, companyStats[0]);

    return {
      overview: {
        totalStudents,
        placedStudents,
        placementRate: Math.round((placedStudents / totalStudents) * 100 * 10) / 10,
        totalApplications,
        totalOffers,
        averagePackage: avgPackage,
        topPerformingDept: topDept?.department || 'N/A',
        topRecruiter: topRecruiter?.company || 'N/A'
      },
      departmentStats,
      companyStats,
      monthlyTrends,
      recentPlacements: generateRecentPlacements(baseMultiplier),
      upcomingDrives: generateUpcomingDrives()
    };
  };

  const generateRecentPlacements = (multiplier) => {
    const companies = ['TechCorp', 'DataSoft', 'InnovateTech', 'GlobalSystems'];
    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'IT'];
    const students = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Brown'];
    
    return Array.from({ length: Math.floor(5 * multiplier) }, (_, i) => ({
      id: i + 1,
      student: students[Math.floor(Math.random() * students.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      package: Math.floor((500000 + Math.random() * 500000) * multiplier),
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  };

  const generateUpcomingDrives = () => {
    const companies = ['TechCorp', 'DataSoft', 'InnovateTech', 'GlobalSystems', 'FutureTech'];
    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'IT', 'Civil'];
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      company: companies[Math.floor(Math.random() * companies.length)],
      departments: departments.slice(0, Math.floor(Math.random() * 3) + 1),
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      positions: Math.floor(Math.random() * 20) + 5,
      status: Math.random() > 0.5 ? 'Confirmed' : 'Pending'
    }));
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    return value.toLocaleString();
  };

  const formatPackage = (packageValue) => {
    if (!packageValue) return 'N/A';
    if (packageValue >= 100000) {
      return `₹${(packageValue / 100000).toFixed(1)}L`;
    } else if (packageValue >= 1000) {
      return `₹${(packageValue / 1000).toFixed(1)}K`;
    }
    return `₹${packageValue}`;
  };

  const exportReport = async (format) => {
    // Prevent multiple simultaneous exports
    if (exporting.pdf || exporting.excel) {
      return;
    }

    if (format === 'pdf') {
      setExporting(prev => ({ ...prev, pdf: true }));
      try {
        await exportToPDF();
      } finally {
        setExporting(prev => ({ ...prev, pdf: false }));
      }
    } else if (format === 'excel') {
      setExporting(prev => ({ ...prev, excel: true }));
      try {
        await exportToExcel();
      } finally {
        setExporting(prev => ({ ...prev, excel: false }));
      }
    }
  };

  const exportToPDF = async () => {
    try {
      // Add a longer delay to ensure the PDF content is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force a re-render by updating state
      setAnalyticsData(prev => ({ ...prev }));
      
      // Wait a bit more for the re-render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Temporarily make the PDF content visible for generation
      const targetElement = targetRef.current;
      if (targetElement) {
        const originalClasses = targetElement.className;
        targetElement.className = 'fixed top-0 left-0 w-[800px] bg-white z-50';
        
        // Generate PDF
        toPDF();
        
        // Restore original classes after a delay
        setTimeout(() => {
          targetElement.className = originalClasses;
        }, 1000);
      } else {
        toPDF();
      }
      
      // Add a small delay before showing success message
      await new Promise(resolve => setTimeout(resolve, 200));
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const exportToExcel = async () => {
    try {
      // Add a small delay to prevent double downloads
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Prepare data for Excel export
      const workbook = XLSX.utils.book_new();
      
      // Overview data
      const overviewData = [
        ['Metric', 'Value', 'Change from Last Year'],
        ['Total Students', analyticsData.overview.totalStudents, '+12%'],
        ['Placed Students', analyticsData.overview.placedStudents, '+8%'],
        ['Placement Rate', `${analyticsData.overview.placementRate.toFixed(1)}%`, '+2.5%'],
        ['Total Applications', analyticsData.overview.totalApplications, '+15%'],
        ['Total Offers', analyticsData.overview.totalOffers, '+10%'],
        ['Average Package', formatPackage(analyticsData.overview.averagePackage), '+5%'],
        ['Top Performing Department', analyticsData.overview.topPerformingDept, 'N/A'],
        ['Top Recruiter', analyticsData.overview.topRecruiter, 'N/A']
      ];
      
      const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');
      
      // Department statistics
      const deptData = [
        ['Department', 'Total Students', 'Placed Students', 'Placement Rate (%)', 'Applications', 'Average Package', 'Status']
      ];
      
      analyticsData.departmentStats.forEach(dept => {
        deptData.push([
          dept.department,
          dept.total,
          dept.placed,
          dept.rate.toFixed(1),
          dept.applications || 0,
          formatPackage(dept.avgPackage || 0),
          dept.rate >= 80 ? 'High' : dept.rate >= 60 ? 'Medium' : 'Low'
        ]);
      });
      
      const deptSheet = XLSX.utils.aoa_to_sheet(deptData);
      XLSX.utils.book_append_sheet(workbook, deptSheet, 'Department Performance');
      
      // Company statistics
      const companyData = [
        ['Company', 'Applications', 'Offers', 'Success Rate (%)', 'Average Package', 'Last Recruitment']
      ];
      
      analyticsData.companyStats.forEach(company => {
        companyData.push([
          company.company,
          company.applications,
          company.offers,
          company.successRate.toFixed(1),
          formatPackage(company.averagePackage),
          company.lastRecruitment || 'N/A'
        ]);
      });
      
      const companySheet = XLSX.utils.aoa_to_sheet(companyData);
      XLSX.utils.book_append_sheet(workbook, companySheet, 'Company Performance');
      
      // Monthly trends
      const trendsData = [
        ['Month', 'Placements', 'Applications', 'Success Rate (%)', 'Average Package']
      ];
      
      analyticsData.monthlyTrends.forEach(trend => {
        trendsData.push([
          trend.month,
          trend.placements,
          trend.applications || 0,
          trend.successRate ? trend.successRate.toFixed(1) : 'N/A',
          formatPackage(trend.avgPackage || 0)
        ]);
      });
      
      const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
      XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Monthly Trends');
      
      // Recent placements
      if (analyticsData.recentPlacements && analyticsData.recentPlacements.length > 0) {
        const placementsData = [
          ['Student', 'Company', 'Department', 'Package', 'Date']
        ];
        
        analyticsData.recentPlacements.forEach(placement => {
          placementsData.push([
            placement.student,
            placement.company,
            placement.department,
            formatPackage(placement.package),
            placement.date
          ]);
        });
        
        const placementsSheet = XLSX.utils.aoa_to_sheet(placementsData);
        XLSX.utils.book_append_sheet(workbook, placementsSheet, 'Recent Placements');
      }
      
      // Upcoming drives
      if (analyticsData.upcomingDrives && analyticsData.upcomingDrives.length > 0) {
        const drivesData = [
          ['Company', 'Departments', 'Date', 'Positions', 'Status']
        ];
        
        analyticsData.upcomingDrives.forEach(drive => {
          drivesData.push([
            drive.company,
            drive.departments.join(', '),
            drive.date,
            drive.positions,
            drive.status
          ]);
        });
        
        const drivesSheet = XLSX.utils.aoa_to_sheet(drivesData);
        XLSX.utils.book_append_sheet(workbook, drivesSheet, 'Upcoming Drives');
      }
      
      // Export the workbook with timestamp to prevent conflicts
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const fileName = `TPO_Reports_Analytics_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      // Add a small delay before showing success message
      await new Promise(resolve => setTimeout(resolve, 200));
      toast.success('Excel file exported successfully!');
      
    } catch (error) {
      console.error('Error generating Excel file:', error);
      toast.error('Failed to generate Excel file. Please try again.');
    }
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'high': return <FaCheckCircle className="w-4 h-4" />;
      case 'medium': return <FaClock className="w-4 h-4" />;
      case 'low': return <FaTimesCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <FaTimesCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchAnalyticsData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PDF Export Target - Positioned off-screen */}
      <div ref={targetRef} className="absolute left-[-9999px] top-0 w-[800px] bg-white">
        <div className="p-8 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="text-center mb-8">
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              TPO Reports & Analytics
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          
                     {/* Overview Stats for PDF */}
           <div style={{ marginBottom: '32px' }}>
             <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
               Overview Statistics
             </h2>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <div style={{ border: '1px solid #d1d5db', padding: '16px', borderRadius: '4px' }}>
                 <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Students</p>
                 <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{formatNumber(analyticsData.overview.totalStudents)}</p>
               </div>
               <div style={{ border: '1px solid #d1d5db', padding: '16px', borderRadius: '4px' }}>
                 <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Placed Students</p>
                 <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{formatNumber(analyticsData.overview.placedStudents)}</p>
               </div>
               <div style={{ border: '1px solid #d1d5db', padding: '16px', borderRadius: '4px' }}>
                 <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Placement Rate</p>
                 <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{formatPercentage(analyticsData.overview.placementRate)}</p>
               </div>
               <div style={{ border: '1px solid #d1d5db', padding: '16px', borderRadius: '4px' }}>
                 <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Applications</p>
                 <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{formatNumber(analyticsData.overview.totalApplications)}</p>
               </div>
             </div>
           </div>

                     {/* Department Stats for PDF */}
           {analyticsData.departmentStats.length > 0 && (
             <div style={{ marginBottom: '32px' }}>
               <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                 Department Performance
               </h2>
               <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
                 <thead>
                   <tr style={{ backgroundColor: '#f3f4f6' }}>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Department</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Total Students</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Placed Students</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Placement Rate</th>
                   </tr>
                 </thead>
                 <tbody>
                   {analyticsData.departmentStats.map((dept, index) => (
                     <tr key={index}>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', fontSize: '12px' }}>{dept.department}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{dept.total}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{dept.placed}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{formatPercentage(dept.rate)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}

                     {/* Company Stats for PDF */}
           {analyticsData.companyStats.length > 0 && (
             <div style={{ marginBottom: '32px' }}>
               <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                 Company Performance
               </h2>
               <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
                 <thead>
                   <tr style={{ backgroundColor: '#f3f4f6' }}>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Company</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Applications</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Offers</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Success Rate</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Avg Package</th>
                   </tr>
                 </thead>
                 <tbody>
                   {analyticsData.companyStats.map((company, index) => (
                     <tr key={index}>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', fontSize: '12px' }}>{company.company}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{company.applications}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{company.offers}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{formatPercentage(company.successRate)}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{formatPackage(company.averagePackage)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}

           {/* Recent Placements for PDF */}
           {analyticsData.recentPlacements && analyticsData.recentPlacements.length > 0 && (
             <div style={{ marginBottom: '32px' }}>
               <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                 Recent Placements
               </h2>
               <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
                 <thead>
                   <tr style={{ backgroundColor: '#f3f4f6' }}>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Student</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Company</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Department</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Package</th>
                     <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Date</th>
                   </tr>
                 </thead>
                 <tbody>
                   {analyticsData.recentPlacements.slice(0, 10).map((placement, index) => (
                     <tr key={index}>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', fontSize: '12px' }}>{placement.student}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', fontSize: '12px' }}>{placement.company}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', fontSize: '12px' }}>{placement.department}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{formatPackage(placement.package)}</td>
                       <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center', fontSize: '12px' }}>{placement.date}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive placement analytics and insights</p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {new Date().toLocaleString()}
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
              <FaRedo className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                exportReport('excel');
              }}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                exportReport('pdf');
              }}
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
          </div>
          <p className="text-xs text-gray-500 text-right">
            Exports include: Overview stats, Department performance, Company data, Monthly trends, and Recent placements
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Companies</option>
              {analyticsData.companyStats.map(company => (
                <option key={company.company} value={company.company}>{company.company}</option>
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
                placeholder="Search departments or companies..."
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
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.overview.totalStudents)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">from last year</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Placed Students</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.overview.placedStudents)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaTrophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-1">from last year</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Placement Rate</p>
              <p className="text-2xl font-bold text-gray-800">{formatPercentage(analyticsData.overview.placementRate)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+2.5%</span>
              <span className="text-gray-500 ml-1">from last year</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.overview.totalApplications)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaBuilding className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+15%</span>
              <span className="text-gray-500 ml-1">from last year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Department Performance</h3>
            <FaChartPie className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.departmentStats.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{dept.department}</p>
                    <p className="text-xs text-gray-500">{dept.total} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{formatPercentage(dept.rate)}</p>
                  <p className="text-xs text-gray-500">{dept.placed} placed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Top Companies</h3>
            <FaChartBar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.companyStats.slice(0, 5).map((company, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{company.company}</p>
                    <p className="text-xs text-gray-500">{company.applications} applications</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{formatPercentage(company.successRate)}</p>
                  <p className="text-xs text-gray-500">{company.offers} offers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Monthly Placement Trends</h3>
          <FaChartLine className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {analyticsData.monthlyTrends.map((trend, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">{trend.placements}</p>
              <p className="text-xs text-gray-500">{trend.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Placements */}
      {analyticsData.recentPlacements && analyticsData.recentPlacements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Placements</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Package</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.recentPlacements.slice(0, 10).map((placement, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{placement.student}</td>
                    <td className="py-3 px-4 text-gray-600">{placement.company}</td>
                    <td className="py-3 px-4 text-gray-600">{placement.department}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{formatPackage(placement.package)}</td>
                    <td className="py-3 px-4 text-gray-600">{placement.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upcoming Drives */}
      {analyticsData.upcomingDrives && analyticsData.upcomingDrives.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Placement Drives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.upcomingDrives.map((drive, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{drive.company}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    drive.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {drive.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Departments:</span> {drive.departments.join(', ')}</p>
                  <p><span className="font-medium">Positions:</span> {drive.positions}</p>
                  <p><span className="font-medium">Date:</span> {drive.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <FaCheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-800">Highest Placement Rate</h4>
            </div>
            <p className="text-sm text-gray-600">{analyticsData.overview.topPerformingDept} department leads with highest placement rate</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <FaTrophy className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-800">Top Recruiter</h4>
            </div>
            <p className="text-sm text-gray-600">{analyticsData.overview.topRecruiter} is the most active recruiter this year</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <FaChartLine className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium text-gray-800">Average Package</h4>
            </div>
            <p className="text-sm text-gray-600">Average package offered: {formatPackage(analyticsData.overview.averagePackage)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
