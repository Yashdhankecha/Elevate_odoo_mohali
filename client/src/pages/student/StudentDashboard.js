
import React from 'react';

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiShieldCheck, HiLockClosed, HiAcademicCap, HiOfficeBuilding, HiChartBar } from 'react-icons/hi';
import {
  Plus, Wand2, FileText, Palette, Briefcase, BookOpen, BarChart2, Users, Filter, AlertCircle, CheckCircle, Calendar, Flame, ArrowRight, Download, PieChart, TrendingUp, ChevronDown, UserCircle
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';


// Dummy data for charts
const donutData = [
  { name: 'Successful', value: 40, color: '#34d399' },
  { name: 'In Progress', value: 35, color: '#fbbf24' },
  { name: 'Rejected', value: 25, color: '#f87171' },
];
const lineData = [
  { month: 'Jan', value: 60 },
  { month: 'Feb', value: 65 },
  { month: 'Mar', value: 70 },
  { month: 'Apr', value: 75 },
  { month: 'May', value: 78 },
  { month: 'Jun', value: 82 },
];


const ProgressBar = ({ value, color }) => (
  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
    <div
      className="h-3 rounded-full transition-all duration-700 ease-out animate-grow"
      style={{ width: `${value}%`, background: color }}
    />
  </div>
);

const ResumeBuilderCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 relative transition-transform duration-300 hover:scale-[1.02] animate-fade-in">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Wand2 className="w-6 h-6 text-blue-500" /> AI-Powered Resume Builder
      </h2>
      <button className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition text-sm font-medium">
        <Plus className="w-4 h-4" /> New Resume
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="border rounded-xl p-4 flex flex-col items-center bg-gradient-to-br from-blue-50 to-white shadow hover:shadow-xl transition animate-fade-in">
        <FileText className="w-8 h-8 text-blue-400 mb-2" />
        <div className="font-medium">Modern Professional</div>
        <span className="text-xs text-blue-500 mt-1 mb-2">Most Popular</span>
        <button className="mt-auto bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm font-medium transition">Use Template</button>
      </div>
      <div className="border rounded-xl p-4 flex flex-col items-center bg-gradient-to-br from-green-50 to-white shadow hover:shadow-xl transition animate-fade-in delay-100">
        <Palette className="w-8 h-8 text-green-400 mb-2" />
        <div className="font-medium">Creative Designer</div>
        <span className="text-xs text-green-500 mt-1 mb-2">New</span>
        <button className="mt-auto bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-sm font-medium transition">Use Template</button>
      </div>
      <div className="border rounded-xl p-4 flex flex-col items-center bg-gradient-to-br from-purple-50 to-white shadow hover:shadow-xl transition animate-fade-in delay-200">
        <Briefcase className="w-8 h-8 text-purple-400 mb-2" />
        <div className="font-medium">Executive Minimal</div>
        <span className="text-xs text-purple-500 mt-1 mb-2">Premium</span>
        <button className="mt-auto bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 text-sm font-medium transition">Use Template</button>
      </div>
    </div>
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2 text-blue-700 text-sm animate-fade-in delay-300">
      <Wand2 className="w-5 h-5" />
      <span>
        <b>AI Auto-Fill Feature:</b> Let AI analyze your profile and automatically populate your resume with relevant content.
      </span>
    </div>
  </div>
);


const PracticeHubCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-indigo-500" /> Practice Hub
      </h2>
      <button className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white px-4 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-indigo-500 transition text-sm font-medium">
        Start Practice
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      {[
        { label: 'Coding', icon: <BarChart2 />, color: 'text-blue-500', acc: 85 },
        { label: 'Aptitude', icon: <Users />, color: 'text-green-500', acc: 92 },
        { label: 'Reasoning', icon: <AlertCircle />, color: 'text-purple-500', acc: 78 },
        { label: 'English', icon: <BookOpen />, color: 'text-yellow-500', acc: 88 },
        { label: 'Company', icon: <Briefcase />, color: 'text-red-500', acc: 90 },
      ].map((s, i) => (
        <div key={i} className="border rounded-xl p-3 flex flex-col items-center hover:shadow-lg transition bg-white animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className={`w-8 h-8 mb-1 ${s.color}`}>{s.icon}</div>
          <div className="font-medium">{s.label}</div>
          <div className="text-xs text-gray-500">{s.acc}% accuracy</div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="font-medium mb-2 text-sm">Recent Practice Sessions</div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 animate-fade-in">
            <span>Arrays & Strings</span>
            <span className="text-green-600 font-semibold">95%</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 animate-fade-in delay-100">
            <span>Probability</span>
            <span className="text-blue-600 font-semibold">87%</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 animate-fade-in delay-200">
            <span>Graphs</span>
            <span className="text-purple-600 font-semibold">91%</span>
          </div>
        </div>
      </div>
      <div>
        <div className="font-medium mb-2 text-sm">Leaderboard Position</div>
        <div className="bg-yellow-50 rounded-lg px-3 py-4 flex flex-col items-center animate-fade-in">
          <span className="text-2xl font-bold text-yellow-600">#12</span>
          <span className="text-xs text-gray-500 mb-1">Out of 2,847 students</span>
          <span className="text-xs text-yellow-700">🔥 You're in the top 1%! Keep practicing to reach top 10.</span>
        </div>
      </div>
    </div>
  </div>
);

const SkillProgressTrackerCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <BarChart2 className="w-6 h-6 text-green-500" /> Skill Progress Tracker
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="font-medium mb-2">Technical Skills</div>
        {[
          { label: 'Data Structures & Algorithms', value: 85, color: 'linear-gradient(90deg,#2563eb,#60a5fa)' },
          { label: 'System Design', value: 72, color: 'linear-gradient(90deg,#22d3ee,#06b6d4)' },
          { label: 'Database Management', value: 68, color: 'linear-gradient(90deg,#a78bfa,#c4b5fd)' },
          { label: 'Web Development', value: 91, color: 'linear-gradient(90deg,#f59e42,#fbbf24)' },
        ].map((s, i) => (
          <div key={i} className="mb-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
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
          { label: 'Communication', value: 88, color: 'linear-gradient(90deg,#2563eb,#60a5fa)' },
          { label: 'Problem Solving', value: 93, color: 'linear-gradient(90deg,#22d3ee,#06b6d4)' },
          { label: 'Leadership', value: 76, color: 'linear-gradient(90deg,#a78bfa,#c4b5fd)' },
          { label: 'Teamwork', value: 85, color: 'linear-gradient(90deg,#f59e42,#fbbf24)' },
        ].map((s, i) => (
          <div key={i} className="mb-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex justify-between text-sm mb-1">
              <span>{s.label}</span>
              <span className="font-semibold">{s.value}%</span>
            </div>
            <ProgressBar value={s.value} color={s.color} />
          </div>
        ))}
      </div>
    </div>
    <div className="mt-4 text-blue-700 text-sm bg-blue-50 rounded-lg px-3 py-2 inline-block animate-fade-in delay-300">
      <Flame className="inline w-4 h-4 mr-1" /> Weekly Growth: <b>+12 points</b> &mdash; Your consistent practice is paying off! Focus on System Design to reach the next level.
    </div>
  </div>
);

const ApplicationVaultCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-pink-500" /> Application Vault
      </h2>
      <div className="flex gap-2">
        <button className="flex items-center gap-1 border px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition text-sm font-medium">
          Browse Jobs
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {[
        { label: 'Software Engineering', count: 152, salary: '₹8-25 LPA', color: 'text-blue-600' },
        { label: 'Data Science', count: 89, salary: '₹10-30 LPA', color: 'text-green-600' },
        { label: 'Product Management', count: 67, salary: '₹12-35 LPA', color: 'text-purple-600' },
      ].map((tab, i) => (
        <div key={i} className={`border rounded-xl p-4 flex flex-col hover:shadow-xl transition cursor-pointer bg-gradient-to-br from-gray-50 to-white animate-fade-in`} style={{ animationDelay: `${i * 80}ms` }}>
          <div className={`font-medium mb-1 ${tab.color}`}>{tab.label}</div>
          <div className="text-xs text-gray-500 mb-2">{tab.count} opportunities available</div>
          <div className="text-sm font-semibold">{tab.salary}</div>
        </div>
      ))}
    </div>
    <div>
      <div className="font-medium mb-2 text-sm">Recent Applications</div>
      <div className="flex flex-col gap-3">
        {[
          {
            logo: <UserCircle className="w-8 h-8 text-blue-400" />, role: 'Software Engineer Intern', company: 'Google', salary: '₹15-20 LPA', status: { label: 'Interview Scheduled', color: 'bg-yellow-100 text-yellow-700' },
          },
          {
            logo: <UserCircle className="w-8 h-8 text-green-400" />, role: 'Product Manager Intern', company: 'Microsoft', salary: '₹18-25 LPA', status: { label: 'Test Completed', color: 'bg-blue-100 text-blue-700' },
          },
          {
            logo: <UserCircle className="w-8 h-8 text-purple-400" />, role: 'iOS Developer Intern', company: 'Apple', salary: '₹20-28 LPA', status: { label: 'Offer Received', color: 'bg-green-100 text-green-700' },
          },
          {
            logo: <UserCircle className="w-8 h-8 text-red-400" />, role: 'Backend Developer', company: 'Netflix', salary: '₹22-30 LPA', status: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
          },
        ].map((app, i) => (
          <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            {app.logo}
            <div className="flex-1">
              <div className="font-medium">{app.role}</div>
              <div className="text-xs text-gray-500">{app.company}</div>
            </div>
            <div className="font-semibold text-sm">{app.salary}</div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${app.status.color}`}>{app.status.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SmartAlertsCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <AlertCircle className="w-6 h-6 text-red-500" /> Smart Alerts
    </h2>
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between bg-red-100 rounded-lg px-4 py-3 animate-fade-in">
        <div>
          <div className="font-medium text-red-700">Urgent: Amazon Coding Test Tomorrow</div>
          <div className="text-xs text-red-600">Your coding assessment is scheduled for Dec 16, 2024 at 2:00 PM. Make sure you're prepared!</div>
        </div>
        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-medium transition">Prepare Now</button>
      </div>
      <div className="flex items-center justify-between bg-orange-100 rounded-lg px-4 py-3 animate-fade-in delay-100">
        <div>
          <div className="font-medium text-orange-700">Application Deadline Approaching</div>
          <div className="text-xs text-orange-600">Netflix Product Manager role applications close in 3 days. Complete your application now!</div>
        </div>
        <button className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm font-medium transition">Apply Now</button>
      </div>
      <div className="flex items-center justify-between bg-blue-100 rounded-lg px-4 py-3 animate-fade-in delay-200">
        <div>
          <div className="font-medium text-blue-700">New Job Match Found</div>
          <div className="text-xs text-blue-600">5 new Software Engineer positions match your profile. Check them out!</div>
        </div>
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm font-medium transition">View Jobs</button>
      </div>
      <div className="flex items-center justify-between bg-green-100 rounded-lg px-4 py-3 animate-fade-in delay-300">
        <div>
          <div className="font-medium text-green-700">Interview Confirmation Received</div>
          <div className="text-xs text-green-600">Tesla has confirmed your technical interview for Dec 22, 2024 at 10:00 AM.</div>
        </div>
        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-medium transition">Add to Calendar</button>
      </div>
    </div>
  </div>
);

const PlacementHistoryCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-6 h-6 text-teal-500" /> Placement History
      </h2>
      <div className="flex gap-2">
        <button className="flex items-center gap-1 border px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition">
          <Download className="w-4 h-4" /> Export Report
        </button>
        <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition text-sm font-medium">
          View Analytics
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center animate-fade-in">
        <div className="text-2xl font-bold text-green-600">2</div>
        <div className="text-xs text-gray-500">Offers Received</div>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center animate-fade-in delay-100">
        <div className="text-2xl font-bold text-blue-600">8</div>
        <div className="text-xs text-gray-500">Companies Applied</div>
      </div>
      <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center animate-fade-in delay-200">
        <div className="text-2xl font-bold text-purple-600">25%</div>
        <div className="text-xs text-gray-500">Success Rate</div>
      </div>
    </div>
    <div>
      <div className="font-medium mb-2 text-sm">Company Application Timeline</div>
      <div className="flex flex-col gap-3">
        <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-3 animate-fade-in">
          <UserCircle className="w-8 h-8 text-blue-400" />
          <div className="flex-1">
            <div className="font-medium">Google <span className="text-xs text-gray-400">Software Engineer Intern</span></div>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>Applied (Nov 20)</span>
              <span>• Test Passed (Nov 28)</span>
              <span>• Interview (Dec 22)</span>
            </div>
          </div>
          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">Interview Scheduled</span>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-3 animate-fade-in delay-100">
          <UserCircle className="w-8 h-8 text-purple-400" />
          <div className="flex-1">
            <div className="font-medium">Apple <span className="text-xs text-gray-400">iOS Developer Intern</span></div>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>Applied (Oct 15)</span>
              <span>• Test Passed (Oct 22)</span>
              <span>• Interview Cleared (Nov 5)</span>
              <span>• Offer (Nov 12)</span>
            </div>
            <div className="text-xs text-green-700 mt-1">Offer Details: ₹28 LPA, Cupertino CA, Joining: July 2025</div>
          </div>
          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">Offer Received</span>
        </div>
      </div>
    </div>
  </div>
);

const PerformanceAnalyticsCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in transition-transform duration-300 hover:scale-[1.02]">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <PieChart className="w-6 h-6 text-blue-500" /> Performance Analytics
      </h2>
      <div>
        <button className="flex items-center gap-1 border px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition">
          Last 30 days <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="font-medium mb-2 text-sm">Application Success Rate</div>
        <ResponsiveContainer width="100%" height={180}>
          <RePieChart>
            <Pie
              data={donutData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
            >
              {donutData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          {donutData.map((d, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: d.color }}></span>
              {d.name}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="font-medium mb-2 text-sm">Skill Development Trend</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lineData}>
            <XAxis dataKey="month" />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center animate-fade-in">
        <div className="text-xl font-bold text-blue-600">92%</div>
        <div className="text-xs text-gray-500">Test Pass Rate</div>
      </div>
      <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center animate-fade-in delay-100">
        <div className="text-xl font-bold text-green-600">78%</div>
        <div className="text-xs text-gray-500">Interview Success</div>
      </div>
      <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center animate-fade-in delay-200">
        <div className="text-xl font-bold text-purple-600">15</div>
        <div className="text-xs text-gray-500">Avg Response Time (days)</div>
      </div>
      <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center animate-fade-in delay-300">
        <div className="text-xl font-bold text-orange-600">4.8</div>
        <div className="text-xs text-gray-500">Profile Rating</div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-full py-8 px-2 md:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <ResumeBuilderCard />
        <PracticeHubCard />
        <SkillProgressTrackerCard />
        <ApplicationVaultCard />
        <SmartAlertsCard />
        <PlacementHistoryCard />
        <PerformanceAnalyticsCard />
      </div>
    </div>
  );
}


