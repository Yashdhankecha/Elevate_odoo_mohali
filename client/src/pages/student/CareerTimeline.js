import React from 'react';
import { Briefcase, CheckCircle, Clock, UserCheck, ArrowRight, Calendar } from 'lucide-react';

const timelineStages = [
  { label: 'Applied', count: 24, color: 'text-green-500', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Test', count: 12, color: 'text-blue-500', icon: <CheckCircle className="w-5 h-5" /> },
  { label: 'Shortlisted', count: 8, color: 'text-yellow-500', icon: <Clock className="w-5 h-5" /> },
  { label: 'Interview', count: 5, color: 'text-purple-500', icon: <UserCheck className="w-5 h-5" /> },
  { label: 'Offer', count: 2, color: 'text-orange-500', icon: <CheckCircle className="w-5 h-5" /> },
  { label: 'Joined', count: 0, color: 'text-gray-400', icon: <ArrowRight className="w-5 h-5" /> },
];

const CareerTimeline = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl md:text-3xl font-bold mb-6">Career Journey Timeline</h1>
    {/* Timeline */}
    <div className="flex flex-wrap gap-4 mb-8">
      {timelineStages.map((stage, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${stage.color} bg-gray-100`}>{stage.icon}</div>
          <span className="text-xs font-semibold text-gray-700">{stage.label}</span>
          <span className="text-xs text-gray-400">{stage.count}</span>
        </div>
      ))}
    </div>
    {/* Recent Applications, Upcoming Tests, Interview Schedule */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-50 rounded-xl p-4">
        <div className="font-semibold mb-2 text-green-700">Recent Applications</div>
        <ul className="text-sm">
          <li className="mb-1 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Google - SWE Intern</li>
          <li className="mb-1 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Microsoft - Product Manager</li>
        </ul>
      </div>
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="font-semibold mb-2 text-blue-700">Upcoming Tests</div>
        <ul className="text-sm">
          <li className="mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Amazon - Coding Test (Dec 18)</li>
          <li className="mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Netflix - Aptitude (Dec 20)</li>
        </ul>
      </div>
      <div className="bg-purple-50 rounded-xl p-4">
        <div className="font-semibold mb-2 text-purple-700">Interview Schedule</div>
        <ul className="text-sm">
          <li className="mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Tesla - Technical (Dec 22)</li>
          <li className="mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Apple - HR Round (Dec 25)</li>
        </ul>
      </div>
    </div>
  </div>
);

export default CareerTimeline;
