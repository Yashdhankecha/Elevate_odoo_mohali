import React, { useState, useEffect, useCallback } from 'react';
import { leetcodeService } from '../../services/leetcode';
import { LEETCODE_TAGS } from '../../config/leetcodeTags';
import { Search, Filter, Rocket, Star, Code, ChevronRight, Hash, AlertTriangle, ShieldCheck, Zap, Flame } from 'lucide-react';

const ProblemCard = ({ problem, onSolve, color }) => {
  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'text-emerald-500 border-emerald-500/20 bg-emerald-50';
      case 'medium': return 'text-amber-500 border-amber-500/20 bg-amber-50';
      case 'hard': return 'text-rose-500 border-rose-500/20 bg-rose-50';
      default: return 'text-slate-400 border-slate-400/20 bg-slate-50';
    }
  };

  const Icon = problem.difficulty === 'Easy' ? ShieldCheck : problem.difficulty === 'Medium' ? Zap : Flame;

  return (
    <div 
      onClick={() => onSolve(problem)}
      className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-800 hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
         <Icon size={80} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${getDifficultyColor(problem.difficulty)}`}>
          <Icon size={12} />
          {problem.difficulty}
        </span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-auto">
          #{problem.frontendQuestionId}
        </span>
      </div>

      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug mb-4 group-hover:translate-x-1 transition-transform">
        {problem.title}
      </h3>

      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
        {problem.topicTags?.slice(0, 3).map(tag => (
          <span key={tag.slug} className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
            {tag.name}
          </span>
        ))}
      </div>

      <button className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-lg">
        Start Solving <Rocket size={12} />
      </button>
    </div>
  );
};

const ProblemList = ({ onSolve }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leetcodeService.fetchProblemsByTopic(selectedTag, 50);
      setProblems(data || []);
    } catch (err) {
      setError('CORS restricted or LeetCode is temporarily blocking this request.');
    } finally {
      setLoading(false);
    }
  }, [selectedTag]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficulty === 'all' || p.difficulty.toLowerCase() === difficulty.toLowerCase();
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="space-y-10">
      {/* Filters Hub */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
           <input 
             value={search}
             onChange={e => setSearch(e.target.value)}
             placeholder="Search by problem title..."
             className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-slate-900 transition-all text-sm font-bold placeholder-slate-400"
           />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative">
            <select 
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              className="pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-700 cursor-pointer focus:outline-none focus:border-slate-900 focus:bg-white appearance-none transition-all min-w-[180px]"
            >
              <option value="all">📁 All Topics</option>
              {LEETCODE_TAGS.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <Hash size={14} />
            </div>
          </div>

          <div className="relative">
            <select 
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-700 cursor-pointer focus:outline-none focus:border-slate-900 focus:bg-white appearance-none transition-all min-w-[160px]"
            >
              <option value="all">⚡ All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <Zap size={14} />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 h-64 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-2xl">
           <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4 animate-bounce" />
           <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">{error}</p>
           <p className="text-sm text-slate-500 mt-2 font-medium max-w-sm mx-auto">Try using a CORS proxy (cors-anywhere) or accessing from a non-restricted network.</p>
           <button onClick={fetchProblems} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg">Retry Fetch</button>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="py-32 text-center bg-white border border-slate-200 rounded-2xl font-black text-slate-300 uppercase tracking-[0.25em]">
           No Problems Found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredProblems.map(p => (
            <ProblemCard key={p.titleSlug} problem={p} onSolve={onSolve} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;
