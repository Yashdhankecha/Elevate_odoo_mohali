import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProblemDescription from '../../../components/PracticeSection/ProblemDescription';
import CodePractice from './CodePractice';
import { leetcodeService } from '../../../services/leetcode';
import { Code2, Terminal, ArrowLeft, Maximize2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PracticeSession = () => {
  const { id: titleSlug } = useParams();
  const navigate = useNavigate();
  const [problemDetail, setProblemDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState('description'); // 'description' or 'editor'

  // Mapping Judge0 Language IDs to LeetCode langSlugs
  const LANG_ID_MAP = {
    63: 'javascript',
    71: 'python3',
    54: 'cpp',
    62: 'java',
    50: 'c'
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const detail = await leetcodeService.fetchProblemDetail(titleSlug);
        setProblemDetail(detail);
      } catch (err) {
        toast.error('Failed to load problem details.');
        navigate('/student-dashboard/practice-hub');
      } finally {
        setLoading(false);
      }
    };
    if (titleSlug) fetchDetail();
  }, [titleSlug, navigate]);

  const getStarterCode = (snippets, langId) => {
    if (!snippets) return '';
    const slug = LANG_ID_MAP[langId];
    const snippet = snippets.find(s => s.langSlug === slug);
    return snippet ? snippet.code : '';
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-1 bg-slate-900 rounded-full animate-pulse shadow-lg" />
        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Initialising Secure Environment...</p>
      </div>
    );
  }

  if (!problemDetail) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden animate-fade-in relative z-20">
      {/* Header Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/student-dashboard/practice-hub')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Code2 size={16} className="text-indigo-500" />
              {problemDetail.title}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Session ID: LC-{problemDetail.titleSlug.slice(0,8)}</p>
          </div>
        </div>

        {/* Desktop/Tablet Mode Options */}
        <div className="hidden md:flex items-center gap-4">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full border border-slate-100">Immersive Mode</span>
           <button 
              onClick={() => navigate('/student-dashboard/practice-hub')}
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
            titleSlug={problemDetail.titleSlug} 
            onBack={() => navigate('/student-dashboard/practice-hub')} 
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
};

export default PracticeSession;
