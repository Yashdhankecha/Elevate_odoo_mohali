import React from 'react';
import { 
  FaChartBar, 
  FaFire, 
  FaChartLine,
  FaCode,
  FaDatabase,
  FaGlobe,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaUsersCog
} from 'react-icons/fa';

const ProgressBar = ({ value, color }) => (
  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
    <div
      className="h-3 rounded-full transition-all duration-700 ease-out"
      style={{ width: `${value}%`, background: color }}
    />
  </div>
);

const SkillTracker = () => {
  const technicalSkills = [
    { label: 'Data Structures & Algorithms', value: 85, color: 'linear-gradient(90deg,#2563eb,#60a5fa)' },
    { label: 'System Design', value: 72, color: 'linear-gradient(90deg,#22d3ee,#06b6d4)' },
    { label: 'Database Management', value: 68, color: 'linear-gradient(90deg,#a78bfa,#c4b5fd)' },
    { label: 'Web Development', value: 91, color: 'linear-gradient(90deg,#f59e42,#fbbf24)' }
  ];

  const softSkills = [
    { label: 'Communication', value: 88, color: 'linear-gradient(90deg,#2563eb,#60a5fa)' },
    { label: 'Problem Solving', value: 93, color: 'linear-gradient(90deg,#22d3ee,#06b6d4)' },
    { label: 'Leadership', value: 76, color: 'linear-gradient(90deg,#a78bfa,#c4b5fd)' },
    { label: 'Teamwork', value: 85, color: 'linear-gradient(90deg,#f59e42,#fbbf24)' }
  ];

  const skillCategories = [
    { name: 'Programming', icon: FaCode, count: 8, mastered: 6 },
    { name: 'Databases', icon: FaDatabase, count: 5, mastered: 3 },
    { name: 'Web Tech', icon: FaGlobe, count: 6, mastered: 4 },
    { name: 'Soft Skills', icon: FaUsers, count: 7, mastered: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Skill Progress Tracker</h2>
          <p className="text-gray-600">Track and improve your technical and soft skills</p>
        </div>
        <div className="flex items-center gap-2 text-blue-700 text-sm bg-blue-50 rounded-lg px-3 py-2">
          <FaFire className="w-4 h-4" />
          <span>Weekly Growth: <b>+12 points</b></span>
        </div>
      </div>

      {/* Skill Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {skillCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 text-blue-500" />
                <span className="font-medium text-gray-800">{category.name}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{category.mastered}/{category.count}</div>
              <div className="text-sm text-gray-500">Skills mastered</div>
            </div>
          );
        })}
      </div>

      {/* Skills Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Technical Skills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCode className="w-5 h-5 text-blue-500" />
            Technical Skills
          </h3>
          <div className="space-y-4">
            {technicalSkills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{skill.label}</span>
                  <span className="font-semibold">{skill.value}%</span>
                </div>
                <ProgressBar value={skill.value} color={skill.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUsers className="w-5 h-5 text-green-500" />
            Soft Skills
          </h3>
          <div className="space-y-4">
            {softSkills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{skill.label}</span>
                  <span className="font-semibold">{skill.value}%</span>
                </div>
                <ProgressBar value={skill.value} color={skill.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <FaChartLine className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Growth Insights</h4>
            <p className="text-sm text-gray-600 mb-3">
              Your consistent practice is paying off! Focus on System Design to reach the next level.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">+12</div>
                <div className="text-xs text-gray-500">Points this week</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-green-600">3</div>
                <div className="text-xs text-gray-500">Skills improved</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-lg font-bold text-purple-600">85%</div>
                <div className="text-xs text-gray-500">Overall progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTracker;
