import React, { useState, useEffect } from 'react';
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
  FaUsersCog,
  FaTrophy
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const ProgressBar = ({ value, color }) => (
  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
    <div
      className="h-3 rounded-full transition-all duration-700 ease-out"
      style={{ 
        width: `${value}%`, 
        background: `linear-gradient(90deg, #${color})` 
      }}
    />
  </div>
);

const SkillTracker = () => {
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getSkills();
      setSkillsData(response.data);
    } catch (error) {
      console.error('Error fetching skills data:', error);
      toast.error('Failed to load skills data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!skillsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load skills data</p>
        <button 
          onClick={fetchSkillsData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { technicalSkills, softSkills, stats } = skillsData;

  // Helper function to get skill color
  const getSkillColor = (skillName) => {
    const colors = {
      'Data Structures & Algorithms': '2563eb,60a5fa',
      'System Design': '22d3ee,06b6d4',
      'Database Management': 'a78bfa,c4b5fd',
      'Web Development': 'f59e42,fbbf24',
      'Communication': '2563eb,60a5fa',
      'Problem Solving': '22d3ee,06b6d4',
      'Leadership': 'a78bfa,c4b5fd',
      'Teamwork': 'f59e42,fbbf24'
    };
    return colors[skillName] || '6b7280,9ca3af';
  };

  const skillCategories = [
    { name: 'Technical Skills', icon: FaCode, count: stats.technical.total, mastered: stats.technical.mastered },
    { name: 'Soft Skills', icon: FaUsers, count: stats.softSkills.total, mastered: stats.softSkills.mastered },
    { name: 'Total Mastered', icon: FaTrophy, count: stats.totalMastered, mastered: stats.totalMastered },
    { name: 'Overall Average', icon: FaChartBar, count: stats.overallAverage, mastered: stats.overallAverage }
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
          <span>Overall Average: <b>{stats.overallAverage}%</b></span>
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
                        <div className="text-2xl font-bold text-gray-800">{category.mastered}</div>
          <div className="text-sm text-gray-500">{category.name === 'Overall Average' ? 'Average Score' : 'Skills mastered'}</div>
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
                  <span className="font-medium">{skill.skill}</span>
                  <span className="font-semibold">{skill.proficiency}%</span>
                </div>
                <ProgressBar value={skill.proficiency} color={`linear-gradient(90deg,#${getSkillColor(skill.skill)})`} />
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUsers className="w-5 h-5 text-blue-500" />
            Soft Skills
          </h3>
          <div className="space-y-4">
            {softSkills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="font-semibold">{skill.proficiency}%</span>
                </div>
                <ProgressBar value={skill.proficiency} color={`linear-gradient(90deg,#${getSkillColor(skill.skill)})`} />
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default SkillTracker;
