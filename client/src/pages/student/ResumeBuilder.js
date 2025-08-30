import React from 'react';
import { Plus, Wand2, FileText, Palette, Briefcase } from 'lucide-react';

const ResumeBuilder = () => (
  <div className="max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">Resume Builder</h1>
      <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm font-medium">
        <Plus className="w-4 h-4" /> New Resume
      </button>
    </div>
    <p className="text-gray-600 mb-6">Create stunning resumes with modern templates and live previews. Use AI to auto-fill your resume with relevant content.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="border rounded-xl p-4 flex flex-col items-center bg-white shadow hover:shadow-lg transition">
        <FileText className="w-8 h-8 text-gray-400 mb-2" />
        <div className="font-medium">Modern Professional</div>
        <span className="text-xs text-blue-500 mt-1 mb-2">Most Popular</span>
        <button className="mt-auto bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm font-medium">Use Template</button>
      </div>
      <div className="border rounded-xl p-4 flex flex-col items-center bg-white shadow hover:shadow-lg transition">
        <Palette className="w-8 h-8 text-gray-400 mb-2" />
        <div className="font-medium">Creative Designer</div>
        <span className="text-xs text-green-500 mt-1 mb-2">New</span>
        <button className="mt-auto bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-sm font-medium">Use Template</button>
      </div>
      <div className="border rounded-xl p-4 flex flex-col items-center bg-white shadow hover:shadow-lg transition">
        <Briefcase className="w-8 h-8 text-gray-400 mb-2" />
        <div className="font-medium">Executive Minimal</div>
        <span className="text-xs text-purple-500 mt-1 mb-2">Premium</span>
        <button className="mt-auto bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 text-sm font-medium">Use Template</button>
      </div>
    </div>
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2 text-blue-700 text-sm mt-4">
      <Wand2 className="w-5 h-5" />
      <span>
        <b>AI Auto-Fill Feature:</b> Let AI analyze your profile and automatically populate your resume with relevant content.
      </span>
    </div>
  </div>
);

export default ResumeBuilder;
