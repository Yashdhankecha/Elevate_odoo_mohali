import React from 'react';
import { BarChart2, Flame } from 'lucide-react';

const ProgressBar = ({ value, color }) => (
  <div className="w-full bg-gray-100 rounded-full h-3">
    <div
      className="h-3 rounded-full"
      style={{ width: `${value}%`, backgroundColor: color }}
    />
  </div>
);

const SkillTracker = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
      <BarChart2 className="w-6 h-6 text-green-500" /> Skill Progress Tracker
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="font-medium mb-2">Technical Skills</div>
        {[
          { label: 'Data Structures & Algorithms', value: 85, color: '#2563eb' },
          { label: 'System Design', value: 72, color: '#22d3ee' },
          { label: 'Database Management', value: 68, color: '#a78bfa' },
          { label: 'Web Development', value: 91, color: '#f59e42' },
        ].map((s, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{s.label}</span>
              <span className="font-semibold">{s.value}%</span>
            </div>
            <ProgressBar value={s.value} color={s.color} />
          </div>
        ))}
      </div>
      <div>
        <div className="font-medium mb-2">Soft Skills</div>
        {[
          { label: 'Communication', value: 88, color: '#2563eb' },
          { label: 'Problem Solving', value: 93, color: '#22d3ee' },
          { label: 'Leadership', value: 76, color: '#a78bfa' },
          { label: 'Teamwork', value: 85, color: '#f59e42' },
        ].map((s, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{s.label}</span>
              <span className="font-semibold">{s.value}%</span>
            </div>
            <ProgressBar value={s.value} color={s.color} />
          </div>
        ))}
      </div>
    </div>
    <div className="mt-6 text-blue-700 text-sm bg-blue-50 rounded-lg px-3 py-2 inline-block">
      <Flame className="inline w-4 h-4 mr-1" /> Weekly Growth: <b>+12 points</b> &mdash; Your consistent practice is paying off! Focus on System Design to reach the next level.
    </div>
  </div>
);

export default SkillTracker;
