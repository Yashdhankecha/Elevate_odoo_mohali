import React from 'react';
import { BarChart2, Users, AlertCircle, BookOpen, Briefcase, Flame } from 'lucide-react';

const PracticeHub = () => (
  <div className="max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">Practice Hub</h1>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm font-medium">
        Start Practice
      </button>
    </div>
    <p className="text-gray-600 mb-6">Sharpen your skills with mock tests and instant analytics. Practice by category or company.</p>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      {[
        { label: 'Coding', icon: <BarChart2 />, color: 'text-blue-500', acc: 85 },
        { label: 'Aptitude', icon: <Users />, color: 'text-green-500', acc: 92 },
        { label: 'Reasoning', icon: <AlertCircle />, color: 'text-purple-500', acc: 78 },
        { label: 'English', icon: <BookOpen />, color: 'text-yellow-500', acc: 88 },
        { label: 'Company', icon: <Briefcase />, color: 'text-red-500', acc: 90 },
      ].map((s, i) => (
        <div key={i} className="border rounded-xl p-3 flex flex-col items-center hover:shadow transition bg-white">
          <div className={`w-8 h-8 mb-1 ${s.color}`}>{s.icon}</div>
          <div className="font-medium">{s.label}</div>
          <div className="text-xs text-gray-500">{s.acc}% accuracy</div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div>
        <div className="font-medium mb-2 text-sm">Recent Practice Sessions</div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
            <span>Arrays & Strings</span>
            <span className="text-green-600 font-semibold">95%</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
            <span>Probability</span>
            <span className="text-blue-600 font-semibold">87%</span>
          </div>
        </div>
      </div>
      <div>
        <div className="font-medium mb-2 text-sm">Leaderboard Position</div>
        <div className="bg-yellow-50 rounded-lg px-3 py-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-yellow-600">#12</span>
          <span className="text-xs text-gray-500 mb-1">Out of 2,847 students</span>
          <span className="text-xs text-yellow-700">🔥 You're in the top 1%! Keep practicing to reach top 10.</span>
        </div>
      </div>
    </div>
    <div className="mt-6 text-blue-700 text-sm bg-blue-50 rounded-lg px-3 py-2 inline-block">
      <Flame className="inline w-4 h-4 mr-1" /> Weekly Growth: <b>+12 points</b> &mdash; Your consistent practice is paying off!
    </div>
  </div>
);

export default PracticeHub;
