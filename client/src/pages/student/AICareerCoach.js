import React from 'react';
import { Wand2, CheckCircle, ArrowRight } from 'lucide-react';

const AICareerCoach = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
      <Wand2 className="w-6 h-6 text-blue-500" /> AI Career Coach
    </h1>
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Wand2 className="w-6 h-6 text-blue-500" />
        <span className="font-semibold text-gray-800">AI Career Coach Insight</span>
      </div>
      <div className="text-gray-700 mb-2">Based on your recent activity, here's what I recommend:</div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2 text-blue-700 text-sm mb-2">
        <CheckCircle className="w-5 h-5 text-blue-500" />
        <span>
          Complete your Google interview preparation. You have a 85% match with Google SWE roles. Practice system design questions to boost your chances.
        </span>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2">
        Take Action <ArrowRight className="w-4 h-4" />
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-50 rounded-xl p-4 flex flex-col gap-2">
        <div className="font-semibold text-green-700">Resume Tip</div>
        <div className="text-sm text-gray-700">Update your resume with your latest project experience for better matching.</div>
      </div>
      <div className="bg-yellow-50 rounded-xl p-4 flex flex-col gap-2">
        <div className="font-semibold text-yellow-700">Practice Suggestion</div>
        <div className="text-sm text-gray-700">Focus on system design and DSA for upcoming interviews.</div>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-2">
        <div className="font-semibold text-blue-700">Application Advice</div>
        <div className="text-sm text-gray-700">Apply to at least 2 new companies this week to maximize your chances.</div>
      </div>
      <div className="bg-purple-50 rounded-xl p-4 flex flex-col gap-2">
        <div className="font-semibold text-purple-700">Interview Prep</div>
        <div className="text-sm text-gray-700">Schedule mock interviews to improve your confidence and performance.</div>
      </div>
    </div>
  </div>
);

export default AICareerCoach;
