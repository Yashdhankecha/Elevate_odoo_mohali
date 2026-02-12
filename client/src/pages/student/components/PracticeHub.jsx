import React, { useState, useEffect } from 'react';
import { 
  FaBookOpen, 
  FaPlay, 
  FaClock, 
  FaTrophy,
  FaChartBar,
  FaFilter,
  FaPlus,
  FaTimes
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const PracticeHub = () => {
  const [sessionsData, setSessionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    category: 'data-structures',
    difficulty: 'medium',
    score: '',
    totalQuestions: '',
    correctAnswers: '',
    timeSpent: ''
  });

  useEffect(() => {
    fetchSessionsData();
  }, [filter]);

  const fetchSessionsData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getPracticeSessions({ category: filter });
      setSessionsData(response.data);
    } catch (error) {
      console.error('Error fetching practice sessions:', error);
      toast.error('Failed to load practice sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentApi.createPracticeSession(formData);
      toast.success('Practice session saved successfully!');
      setShowForm(false);
      setFormData({
        topic: '',
        category: 'data-structures',
        difficulty: 'medium',
        score: '',
        totalQuestions: '',
        correctAnswers: '',
        timeSpent: ''
      });
      fetchSessionsData();
    } catch (error) {
      console.error('Error creating practice session:', error);
      toast.error('Failed to save practice session');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sessionsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load practice sessions</p>
        <button 
          onClick={fetchSessionsData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { sessions, categoryStats } = sessionsData;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'system-design', label: 'System Design' },
    { value: 'database', label: 'Database' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'soft-skills', label: 'Soft Skills' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Practice Hub</h2>
          <p className="text-gray-600">Track your practice sessions and improve your skills</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition text-sm font-medium flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add Session
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categoryStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stat.count}</div>
            <div className="text-sm text-gray-600">{stat.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            <div className="text-xs text-gray-500">Avg: {stat.averageScore}%</div>
          </div>
        ))}
      </div>

      {/* Practice Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Practice Sessions</h3>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaBookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{session.topic}</h4>
                  <p className="text-sm text-gray-500">
                    {session.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {session.difficulty}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{session.score}%</div>
                <div className="text-sm text-gray-500">{session.timeSpent} min</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Practice Session Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Practice Session</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Score (%)</label>
                  <input
                    type="number"
                    name="score"
                    value={formData.score}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time (min)</label>
                  <input
                    type="number"
                    name="timeSpent"
                    value={formData.timeSpent}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
                  <input
                    type="number"
                    name="totalQuestions"
                    value={formData.totalQuestions}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answers</label>
                  <input
                    type="number"
                    name="correctAnswers"
                    value={formData.correctAnswers}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeHub;
