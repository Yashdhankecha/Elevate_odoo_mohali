import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Briefcase,
  FileText,
  BookOpen,
  LineChart,
  Calendar,
  Trophy,
  Bot,
  Star
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Job Applications', to: '/job-applications', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Resume Builder', to: '/resume-builder', icon: <FileText className="w-5 h-5" /> },
  { label: 'Practice Hub', to: '/practice-hub', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Skill Tracker', to: '/skill-tracker', icon: <LineChart className="w-5 h-5" /> },
  { label: 'Career Timeline', to: '/career-timeline', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Placement History', to: '/placement-history', icon: <Trophy className="w-5 h-5" /> },
  { label: 'AI Career Coach', to: '/ai-career-coach', icon: <Bot className="w-5 h-5" /> },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col justify-between fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 shadow-md">
      <div>
        <div className="flex items-center gap-2 px-6 py-6">
          <span className="text-xl font-bold text-blue-600">Elevate</span>
          <span className="text-xs text-gray-400">Your Career Journey Companion</span>
        </div>
        <nav className="flex-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium text-gray-700 hover:bg-blue-50 transition-all ${
                  isActive ? 'bg-blue-50 text-blue-600' : ''
                }`
              }
              end={item.to === '/'}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-4 pb-6">
        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
          <Star className="w-6 h-6 text-yellow-400" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-700">Career Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-gradient-to-r from-purple-500 to-blue-400 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-700 ml-2">78%</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

