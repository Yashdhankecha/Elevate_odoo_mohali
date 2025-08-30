import React from 'react';
import { 
  FaFileAlt, 
  FaPlus, 
  FaDownload, 
  FaEdit,
  FaEye,
  FaStar
} from 'react-icons/fa';

const ResumeBuilder = () => {
  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      category: 'Most Popular',
      categoryColor: 'text-blue-500',
      icon: FaFileAlt,
      iconColor: 'text-blue-400',
      bgColor: 'from-blue-50 to-white'
    },
    {
      id: 2,
      name: 'Creative Designer',
      category: 'New',
      categoryColor: 'text-green-500',
      icon: FaFileAlt,
      iconColor: 'text-green-400',
      bgColor: 'from-green-50 to-white'
    },
    {
      id: 3,
      name: 'Executive Minimal',
      category: 'Premium',
      categoryColor: 'text-purple-500',
      icon: FaFileAlt,
      iconColor: 'text-purple-400',
      bgColor: 'from-purple-50 to-white'
    }
  ];

  const recentResumes = [
    {
      id: 1,
      name: 'Software Engineer Resume',
      lastModified: '2 hours ago',
      status: 'Complete',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
      name: 'Data Science Resume',
      lastModified: '1 day ago',
      status: 'Draft',
      statusColor: 'bg-yellow-100 text-yellow-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Resume Builder</h2>
          <p className="text-gray-600">Create professional resumes with AI-powered assistance</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition text-sm font-medium">
          <FaPlus className="w-4 h-4" /> New Resume
        </button>
      </div>

      {/* Templates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.id} className={`border rounded-xl p-4 flex flex-col items-center bg-gradient-to-br ${template.bgColor} shadow hover:shadow-xl transition cursor-pointer`}>
                <Icon className={`w-8 h-8 ${template.iconColor} mb-2`} />
                <div className="font-medium text-center">{template.name}</div>
                <span className={`text-xs ${template.categoryColor} mt-1 mb-2`}>{template.category}</span>
                <button className="mt-auto bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm font-medium transition">
                  Use Template
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Features */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <FaStar className="w-5 h-5 text-blue-500" />
          <div>
            <h4 className="font-medium text-blue-700">AI Auto-Fill Feature</h4>
            <p className="text-sm text-blue-600">
              Let AI analyze your profile and automatically populate your resume with relevant content.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Resumes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Resumes</h3>
        <div className="space-y-3">
          {recentResumes.map((resume) => (
            <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <FaFileAlt className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">{resume.name}</p>
                  <p className="text-xs text-gray-500">Last modified: {resume.lastModified}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${resume.statusColor}`}>
                  {resume.status}
                </span>
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <FaEye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
                  <FaEdit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                  <FaDownload className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
