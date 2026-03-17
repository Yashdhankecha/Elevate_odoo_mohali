import React, { useState, useEffect } from 'react';
import { leetcodeService } from '../../services/leetcode';
import { ShieldCheck, Zap, Flame, Info, BookOpen, Clock, BarChart3, ChevronLeft, ArrowLeftCircle, Loader2 } from 'lucide-react';

const ProblemDescription = ({ titleSlug, onBack }) => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await leetcodeService.fetchProblemDetail(titleSlug);
        setProblem(data);
      } catch (err) {
        setError('Failed to load problem details. CORS or LeetCode block.');
      } finally {
        setLoading(false);
      }
    };
    if (titleSlug) fetchDetail();
  }, [titleSlug]);

  if (loading) return (
    <div className="h-full bg-white border-r border-slate-200 flex flex-col items-center justify-center p-12 text-slate-300 animate-pulse">
       <Loader2 size={40} className="animate-spin mb-4" />
       <p className="font-black uppercase tracking-widest text-xs">Parsing Problem Content...</p>
    </div>
  );

  if (error || !problem) return (
    <div className="h-full bg-white border-r border-slate-200 p-8 text-center flex flex-col items-center justify-center">
       <Info size={48} className="text-rose-500 mb-6" />
       <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Content Unavailable</h3>
       <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed mb-8">{error}</p>
       <button onClick={onBack} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg">
          <ArrowLeftCircle size={14} /> Back to List
       </button>
    </div>
  );

  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'text-emerald-500 bg-emerald-50 border-emerald-500/20';
      case 'medium': return 'text-amber-500 bg-amber-50 border-amber-500/20';
      case 'hard': return 'text-rose-500 bg-rose-50 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-50 border-slate-400/20';
    }
  };

  const Icon = problem.difficulty === 'Easy' ? ShieldCheck : problem.difficulty === 'Medium' ? Zap : Flame;

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden border-r border-slate-200 shadow-inner group">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10 selection:bg-indigo-100">
        
        {/* Header Section */}
        <div className="space-y-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase tracking-[0.25em] text-[10px]">
             <ChevronLeft size={14} /> Back to Problems
          </button>
          
          <div className="flex flex-wrap items-center gap-3">
             <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${getDifficultyColor(problem.difficulty)}`}>
               <Icon size={12} />
               {problem.difficulty}
             </span>
             <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded uppercase tracking-[0.2em]">
               #{problem.questionId || problem.questionFrontendId}
             </span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {problem.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {problem.topicTags?.map(tag => (
              <span key={tag.slug} className="text-[9px] font-black text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded uppercase tracking-wider shadow-sm transition-all hover:border-slate-400 hover:text-slate-800 cursor-default">
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Problem Statement Body */}
        <div className="space-y-6 prose prose-slate max-w-none">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
              <h3 className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase">Problem Description</h3>
           </div>
           
           <div 
             className="text-slate-600 leading-[1.8] font-medium text-sm space-y-4 leetcode-content"
             dangerouslySetInnerHTML={{ __html: problem.content }}
           />
        </div>

        {/* Extra Stats/Metadata (Optional) */}
        {problem.stats && (
           <div className="grid grid-cols-2 gap-4 pt-10 border-t border-slate-50">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 items-center justify-center text-center shadow-sm">
                 <Clock size={16} className="text-slate-400 mb-1" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time Constraint</span>
                 <span className="text-sm font-black text-slate-900">~1s (standard)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 items-center justify-center text-center shadow-sm">
                 <BarChart3 size={16} className="text-slate-400 mb-1" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Difficulty</span>
                 <span className="text-sm font-black text-slate-900 tracking-tight capitalize">{problem.difficulty}</span>
              </div>
           </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leetcode-content pre {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 1.25rem;
          border-radius: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.85rem;
          color: #1e293b;
          white-space: pre-wrap;
          margin: 1.5rem 0;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        }
        .leetcode-content code {
          background-color: #f1f5f9;
          padding: 0.2rem 0.4rem;
          border-radius: 0.375rem;
          font-size: 0.9em;
          color: #0f172a;
          font-weight: 600;
        }
        .leetcode-content ul, .leetcode-content ol {
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          list-style-type: decimal;
        }
        .leetcode-content li {
          margin-bottom: 0.75rem;
        }
        .leetcode-content strong {
          color: #0f172a;
          font-weight: 800;
        }
        .leetcode-content p {
          margin-bottom: 1.25rem;
        }
      `}} />
    </div>
  );
};

export default ProblemDescription;
