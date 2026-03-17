import React, { useState, useEffect } from 'react';
import { leetcodeService } from '../../services/leetcode';
import { Zap, Calendar, ArrowRight, Skull, ShieldCheck, Flame } from 'lucide-react';

const DailyChallenge = ({ onSolve }) => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        setLoading(true);
        const data = await leetcodeService.fetchDailyChallenge();
        setChallenge(data);
      } catch (err) {
        setError('CORS issue or LeetCode is down. Please try again with a proxy if blocked.');
      } finally {
        setLoading(false);
      }
    };
    fetchToday();
  }, []);

  if (loading) return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-8 animate-pulse shadow-2xl">
      <div className="h-4 bg-white/5 w-24 rounded mb-4"></div>
      <div className="h-8 bg-white/10 w-3/4 rounded mb-6"></div>
      <div className="h-4 bg-white/5 w-1/2 rounded"></div>
    </div>
  );

  if (error || !challenge) return (
    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-8 text-rose-300">
      <Skull size={24} className="mb-4 text-rose-500" />
      <h3 className="text-xl font-black uppercase tracking-widest mb-2">Challenge Unavailable</h3>
      <p className="text-sm font-medium opacity-70 leading-relaxed mb-6">
        Unable to fetch today's challenge. This is likely due to CORS restrictions from LeetCode or a network failure.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-rose-500 text-white rounded font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all shadow-lg"
      >
        Retry Connection
      </button>
    </div>
  );

  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10';
      case 'medium': return 'text-amber-400 border-amber-400/20 bg-amber-400/10';
      case 'hard': return 'text-rose-400 border-rose-400/20 bg-rose-400/10';
      default: return 'text-slate-400 border-slate-400/20 bg-slate-400/10';
    }
  };

  const getIcon = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy': return <ShieldCheck size={14} />;
      case 'medium': return <Zap size={14} />;
      case 'hard': return <Flame size={14} />;
      default: return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-white/10 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
         <Calendar size={120} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded border border-white/10 font-black text-[9px] text-white uppercase tracking-widest">
            <Calendar size={12} className="text-indigo-400" />
            <span>Today's Challenge</span>
          </div>
          <span className={`px-2.5 py-1 rounded border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${getDifficultyColor(challenge.difficulty)}`}>
            {getIcon(challenge.difficulty)}
            {challenge.difficulty}
          </span>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-4 group-hover:translate-x-1 transition-transform cursor-default">
          {challenge.title}
        </h2>

        <div className="flex flex-wrap gap-2 mb-10">
          {challenge.topicTags.map(tag => (
            <span key={tag.slug} className="text-[10px] font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/5 tracking-wider uppercase">
              {tag.name}
            </span>
          ))}
        </div>

        <button 
          onClick={() => onSolve(challenge)}
          className="mt-auto w-fit bg-white text-slate-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:bg-slate-100 active:scale-95 transition-all shadow-xl hover:shadow-white/10"
        >
          Solve Today's Challenge <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default DailyChallenge;
