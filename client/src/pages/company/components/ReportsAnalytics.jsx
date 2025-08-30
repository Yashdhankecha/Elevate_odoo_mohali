import React, { useState } from 'react';
import { 
  FaChartBar, 
  FaDownload, 
  FaFileExcel, 
  FaFilePdf, 
  FaFileCsv 
} from 'react-icons/fa';

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view recruitment reports</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaDownload className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <FaFileExcel className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-gray-800">Application Statistics</div>
                <div className="text-sm text-gray-500">Complete application data in Excel format</div>
              </div>
            </div>
            <FaDownload className="w-4 h-4 text-gray-400" />
          </button>
          
          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <FaFilePdf className="w-6 h-6 text-red-600" />
              <div className="text-left">
                <div className="font-medium text-gray-800">Detailed Report</div>
                <div className="text-sm text-gray-500">Comprehensive analysis in PDF format</div>
              </div>
            </div>
            <FaDownload className="w-4 h-4 text-gray-400" />
          </button>
          
          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <FaFileCsv className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-800">Raw Data</div>
                <div className="text-sm text-gray-500">Database export in CSV format</div>
              </div>
            </div>
            <FaDownload className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Placeholder for charts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics Dashboard</h3>
        <div className="text-center py-12 text-gray-500">
          <FaChartBar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Charts and analytics will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
