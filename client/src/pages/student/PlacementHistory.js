import React from 'react';
import { Users, Download, Trophy, Briefcase, CheckCircle } from 'lucide-react';

const PlacementHistory = () => (
  <div className="max-w-4xl mx-auto">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
        <Trophy className="w-6 h-6 text-green-500" /> Placement History
      </h1>
      <div className="flex gap-2">
        <button className="flex items-center gap-1 border px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition">
          <Download className="w-4 h-4" /> Export Report
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm font-medium">
          View Analytics
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-green-600">2</div>
        <div className="text-xs text-gray-500">Offers Received</div>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-blue-600">8</div>
        <div className="text-xs text-gray-500">Companies Applied</div>
      </div>
      <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-purple-600">25%</div>
        <div className="text-xs text-gray-500">Success Rate</div>
      </div>
    </div>
    <div>
      <div className="font-medium mb-2 text-sm">Company Application Timeline</div>
      <div className="flex flex-col gap-3">
        <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg">G</div>
          <div className="flex-1">
            <div className="font-medium">Google <span className="text-xs text-gray-400">Software Engineer Intern</span></div>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>Applied (Nov 20)</span>
              <span>• Test Passed (Nov 28)</span>
              <span>• Interview (Dec 22)</span>
            </div>
          </div>
          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">Interview Scheduled</span>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg">A</div>
          <div className="flex-1">
            <div className="font-medium">Apple <span className="text-xs text-gray-400">iOS Developer Intern</span></div>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>Applied (Oct 15)</span>
              <span>• Test Passed (Oct 22)</span>
              <span>• Interview Cleared (Nov 5)</span>
              <span>• Offer (Nov 12)</span>
            </div>
            <div className="text-xs text-green-700 mt-1">Offer Details: ₹28 LPA, Cupertino CA, Joining: July 2025</div>
          </div>
          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">Offer Received</span>
        </div>
      </div>
    </div>
  </div>
);

export default PlacementHistory;
