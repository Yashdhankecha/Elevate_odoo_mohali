import React, { useState, useEffect } from 'react';
import DailyChallenge from '../../../components/PracticeSection/DailyChallenge';
import ProblemList from '../../../components/PracticeSection/ProblemList';
import ProblemDescription from '../../../components/PracticeSection/ProblemDescription';
import CodePractice from './CodePractice';
import { leetcodeService } from '../../../services/leetcode';
import { Layout, Maximize2, Minimize2, ChevronLeft, Terminal, LayoutPanelLeft, FileText, Code2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PracticeHub = () => {
  const [activeProblem, setActiveProblem] = useState(null);
  const [problemDetail, setProblemDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [mobileView, setMobileView] = useState('description'); // 'description' or 'editor'

  // Mapping Judge0 Language IDs to LeetCode langSlugs
  const LANG_ID_MAP = {
    63: 'javascript',
    71: 'python3',
    54: 'cpp',
    62: 'java',
    50: 'c'
  };

  const handleSolveProblem = async (problem) => {
    try {
      setLoading(true);
      setActiveProblem(problem);
      
      const detail = await leetcodeService.fetchProblemDetail(problem.titleSlug);
      setProblemDetail(detail);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error('Failed to load problem details.');
    } finally {
      setLoading(false);
    }
  };

  const getStarterCode = (snippets, langId) => {
    if (!snippets) return '';
    const slug = LANG_ID_MAP[langId];
    const snippet = snippets.find(s => s.langSlug === slug);
    return snippet ? snippet.code : '';
  };

  // Immersive Solver View
  if (activeProblem && problemDetail) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-fade-in relative">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setActiveProblem(null); setProblemDetail(null); }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Code2 size={16} className="text-indigo-500" />
                {activeProblem.title}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Session ID: LC-{activeProblem.titleSlug.slice(0,8)}</p>
            </div>
          </div>

          {/* Desktop/Tablet Mode: Side-by-Side indicator or Quit */}
          <div className="hidden md:flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full border border-slate-100">Immersive Mode</span>
             <button 
                onClick={() => { setActiveProblem(null); setProblemDetail(null); }}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
             >
                Exit Session
             </button>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex md:hidden bg-slate-100 p-1 rounded-xl items-center border border-slate-200">
             <button 
               onClick={() => setMobileView('description')}
               className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mobileView === 'description' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
             >
               Problem
             </button>
             <button 
               onClick={() => setMobileView('editor')}
               className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mobileView === 'editor' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
             >
               Editor
             </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Problem Sidebar (Left) */}
          <div className={`
             ${mobileView === 'description' ? 'flex' : 'hidden'} md:flex
             w-full md:w-[40%] lg:w-[35%] h-full border-r border-slate-100 bg-white overflow-hidden
          `}>
            <ProblemDescription 
              titleSlug={activeProblem.titleSlug} 
              onBack={() => { setActiveProblem(null); setProblemDetail(null); }} 
            />
          </div>

          {/* Compiler (Right) */}
          <div className={`
             ${mobileView === 'editor' ? 'flex' : 'hidden'} md:flex
             flex-1 h-full bg-slate-50 overflow-hidden flex flex-col
          `}>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-5xl mx-auto h-full">
                  <CodePractice 
                     initialCode={getStarterCode(problemDetail.codeSnippets, 63)}
                     initialLanguageId={63}
                     initialStdin={problemDetail.sampleTestCase || problemDetail.exampleTestcases}
                  />
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Hub View (Responsive with Sidebar)
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

      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[200] flex flex-col items-center justify-center space-y-4">
           <div className="w-16 h-1 bg-slate-900 rounded-full animate-pulse shadow-lg" />
           <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Preparing Session Environment...</p>
        </div>
      )}
    </div>
  );
};

export default PracticeHub;
