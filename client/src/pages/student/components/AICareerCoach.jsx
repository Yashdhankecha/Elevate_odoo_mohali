import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, 
  FaRobot, 
  FaLightbulb, 
  FaChartLine,
  FaUserGraduate,
  FaComments,
  FaBook,
  FaBullseye,
  FaStar
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const AICareerCoach = () => {
  const [selectedTopic, setSelectedTopic] = useState('interview');
  const [aiCoachData, setAiCoachData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAICoachData();
  }, []);

  const loadAICoachData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAICoachData();
      if (response.success) {
        setAiCoachData(response.data);
      }
    } catch (error) {
      console.error('Error loading AI coach data:', error);
      toast.error('Failed to load AI coach data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (topic) => {
    try {
      await studentApi.createAISession({ topic, type: selectedTopic });
      toast.success('AI coaching session started!');
    } catch (error) {
      console.error('Error starting AI session:', error);
      toast.error('Failed to start AI session');
    }
  };

  const coachingTopics = [
    { id: 'interview', label: 'Interview Prep', icon: FaComments, color: 'text-blue-500' },
    { id: 'resume', label: 'Resume Review', icon: FaBook, color: 'text-green-500' },
    { id: 'career', label: 'Career Guidance', icon: FaBullseye, color: 'text-purple-500' },
    { id: 'skills', label: 'Skill Development', icon: FaChartLine, color: 'text-orange-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const aiInsights = aiCoachData?.aiInsights || [
    {
      title: 'Interview Performance Analysis',
      description: 'Based on your recent mock interviews, focus on system design questions',
      icon: FaLightbulb,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Resume Optimization',
      description: 'Your resume could be improved by adding more quantifiable achievements',
      icon: FaStar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Career Path Recommendation',
      description: 'Consider exploring Product Management roles based on your profile',
      icon: FaUserGraduate,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  const recentConversations = aiCoachData?.recentConversations || [
    {
      id: 1,
      topic: 'System Design Interview Tips',
      date: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      topic: 'Resume Feedback Request',
      date: '1 day ago',
      status: 'in-progress'
    },
    {
      id: 3,
      topic: 'Career Path Discussion',
      date: '3 days ago',
      status: 'completed'
    }
  ];

  const performanceMetrics = aiCoachData?.performanceMetrics || {
    coachingSessions: 15,
    interviewSuccess: 92,
    skillsImproved: 8,
    coachRating: 4.8
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Career Coach</h2>
          <p className="text-gray-600">Get personalized career guidance and interview preparation</p>
        </div>
        <button 
          onClick={() => handleStartSession('General Career Guidance')}
          className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-purple-500 transition text-sm font-medium"
        >
          Start New Session
        </button>
      </div>

      {/* AI Coach Introduction */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <FaRobot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Your AI Career Coach</h3>
            <p className="text-gray-600">
              I'm here to help you excel in your career journey. I can assist with interview preparation, 
              resume optimization, career guidance, and skill development strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Coaching Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What would you like to work on?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {coachingTopics.map((topic) => {
            const Icon = topic.icon;
            const isActive = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`p-4 rounded-xl border transition-all ${
                  isActive 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                }`}
              >
                <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-purple-500' : topic.color}`} />
                <div className={`font-medium ${isActive ? 'text-purple-700' : 'text-gray-700'}`}>
                  {topic.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Insights & Recommendations</h3>
        <div className="space-y-4">
          {aiInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className={`${insight.bgColor} rounded-lg p-4 border border-gray-100`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${insight.color} mt-1`} />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Conversations</h3>
          <div className="space-y-3">
            {recentConversations.map((conversation) => (
              <div key={conversation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{conversation.topic}</p>
                  <p className="text-xs text-gray-500">{conversation.date}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  conversation.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {conversation.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleStartSession('Mock Interview Practice')}
              className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FaComments className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">Practice Mock Interview</p>
                  <p className="text-xs text-gray-500">Get real-time feedback on your responses</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => handleStartSession('Resume Analysis')}
              className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FaBook className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-800">Resume Analysis</p>
                  <p className="text-xs text-gray-500">Get AI-powered resume feedback</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => handleStartSession('Career Path Planning')}
              className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FaBullseye className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-800">Career Path Planning</p>
                  <p className="text-xs text-gray-500">Explore different career opportunities</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{performanceMetrics.coachingSessions}</div>
          <div className="text-sm text-gray-600">Coaching Sessions</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{performanceMetrics.interviewSuccess}%</div>
          <div className="text-sm text-gray-600">Interview Success</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{performanceMetrics.skillsImproved}</div>
          <div className="text-sm text-gray-600">Skills Improved</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-orange-600">{performanceMetrics.coachRating}</div>
          <div className="text-sm text-gray-600">Coach Rating</div>
        </div>
      </div>
    </div>
  );
};

export default AICareerCoach;
