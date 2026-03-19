import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyChallenge from '../../../components/PracticeSection/DailyChallenge';
import ProblemList from '../../../components/PracticeSection/ProblemList';
import { LayoutPanelLeft } from 'lucide-react';

const PracticeHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const handleSolveProblem = (problem) => {
    // Navigate to a separate page for the practice session
    navigate(`/student-dashboard/solve/${problem.titleSlug}`);
  };

  return (
    <div className="space-y-12 pb-20 selection:bg-indigo-100 animate-fade-in">
      {/* Header & Daily Challenge */}
      <div className="pt-2">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                     <LayoutPanelLeft size={20} />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Practice Hub</h1>
               </div>
               <p className="text-slate-500 font-medium text-sm max-w-lg">
                  Master your technical skills with real-world LeetCode challenges and our integrated compiler.
               </p>
            </div>
            
            <div className="flex bg-slate-100 p-1.5 rounded-2xl items-center border border-slate-200 w-fit self-start md:self-auto">
               <button 
                 onClick={() => setActiveTab('all')}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white shadow-md text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
               >
                 All Challenges
               </button>
               <button 
                 onClick={() => setActiveTab('topic')}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'topic' ? 'bg-white shadow-md text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
               >
                 Topic Explorer
               </button>
            </div>
         </div>

         <DailyChallenge onSolve={handleSolveProblem} />
      </div>

      <div className="h-px bg-slate-200 w-full" />

      {/* Main Problem Explorer */}
      <div className="space-y-8">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.25em]">
               {activeTab === 'all' ? 'Featured Problem Set' : 'Explorer by Category'}
            </h2>
         </div>
         
         <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <ProblemList onSolve={handleSolveProblem} />
         </div>
      </div>
    </div>
  );
};

export default PracticeHub;
