import React, { useState, useEffect } from 'react';
import { 
  FaBookOpen, 
  FaPlay, 
  FaClock, 
  FaTrophy,
  FaChartBar,
  FaFilter,
  FaPlus,
  FaTimes
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const PracticeHub = () => {
  const [sessionsData, setSessionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    category: 'data-structures',
    difficulty: 'medium',
    score: '',
    totalQuestions: '',
    correctAnswers: '',
    timeSpent: ''
  });

  useEffect(() => {
    fetchSessionsData();
  }, [filter]);

  const fetchSessionsData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getPracticeSessions({ category: filter });
      setSessionsData(response.data);
    } catch (error) {
      console.error('Error fetching practice sessions:', error);
      toast.error('Failed to load practice sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentApi.createPracticeSession(formData);
      toast.success('Session saved successfully!');
      setShowForm(false);
      setFormData({
        topic: '',
        category: 'data-structures',
        difficulty: 'medium',
        score: '',
        totalQuestions: '',
        correctAnswers: '',
        timeSpent: ''
      });
      fetchSessionsData();
    } catch (error) {
      toast.error('Failed to save session');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'totalQuestions' || name === 'correctAnswers') {
        const total = parseFloat(name === 'totalQuestions' ? value : prev.totalQuestions);
        const correct = parseFloat(name === 'correctAnswers' ? value : prev.correctAnswers);
        
        if (total > 0 && !isNaN(correct)) {
          // Calculate percentage and cap at 100
          const calcScore = Math.round((correct / total) * 100);
          newData.score = Math.min(100, Math.max(0, calcScore)); 
        } else if (!value) {
           newData.score = ''; // Clear score if inputs are empty
        }
      }
      return newData;
    });
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'system-design', label: 'System Design' },
    { value: 'database', label: 'Database' },
    { value: 'web-development', label: 'Web Dev' },
    { value: 'machine-learning', label: 'ML/AI' },
    { value: 'soft-skills', label: 'Behavioural' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="w-16 h-16 border-4 border-indigo-50 flex items-center justify-center rounded-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-indigo-600 animate-grow h-1 origin-bottom"></div>
           <FaBookOpen className="text-indigo-200 animate-pulse" size={24} />
        </div>
        <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Practice Data...</p>
      </div>
    );
  }

  const { sessions, categoryStats } = sessionsData;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight uppercase">Practice Hub</h2>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Log and track your technical practice sessions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded shadow-sm hover:bg-slate-800 transition-colors font-bold uppercase tracking-widest text-[11px] flex items-center gap-2"
        >
          <FaPlus size={10} />
          Log New Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Sessions', val: sessions.length, icon: FaPlay, color: 'from-indigo-600 to-blue-600' },
           { label: 'Avg Accuracy', val: `${Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / (sessions.length || 1))}%`, icon: FaTrophy, color: 'from-amber-500 to-orange-600' },
           { label: 'Time Spent', val: `${Math.round(sessions.reduce((acc, s) => acc + Number(s.timeSpent), 0) / 60)}h`, icon: FaClock, color: 'from-emerald-500 to-teal-600' },
           { label: 'Topics Covered', val: categoryStats.length, icon: FaChartBar, color: 'from-rose-500 to-pink-600' }
         ].map((s, i) => (
           <div key={i} className="bg-white border border-slate-200 p-6 rounded shadow-sm hover:border-slate-300 transition-colors flex items-center gap-4">
              <div className={`w-12 h-12 rounded bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-100 shrink-0`}>
                 <s.icon size={18} />
              </div>
              <div className="min-w-0">
                 <p className="text-2xl font-bold text-slate-900 truncate">{s.val}</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 truncate">{s.label}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Column - Topics */}
        <div className="lg:col-span-4 space-y-8">
           <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest px-2 flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
                 Categories
              </h3>
              <div className="flex flex-wrap gap-2 px-1">
                 {categories.map(cat => (
                   <button
                     key={cat.value}
                     onClick={() => setFilter(cat.value)}
                     className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors border ${
                       filter === cat.value 
                         ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                         : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                     }`}
                   >
                     {cat.label}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest px-2">Topic Mastery</h3>
              <div className="space-y-3">
                 {categoryStats.map((stat, idx) => (
                   <div key={idx} className="bg-white border border-slate-200 p-5 rounded shadow-sm hover:border-slate-300 transition-colors relative">
                      <div className="flex justify-between items-center mb-3">
                         <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{stat.category.replace('-', ' ')}</p>
                         <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{stat.count} Sessions</span>
                      </div>
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                         <div 
                           className="absolute inset-0 bg-slate-400 transition-all duration-500"
                           style={{ width: `${stat.averageScore}%` }}
                         ></div>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Score</span>
                         <span className="text-[10px] font-bold text-slate-900">{stat.averageScore}%</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
                 Recent Sessions
              </h3>
              <FaFilter className="text-gray-400" size={14} />
           </div>

           <div className="space-y-4">
              {sessions.map((session, idx) => (
                <div key={idx} className="bg-white border border-slate-200 group p-6 rounded shadow-sm hover:border-slate-300 transition-colors flex items-center justify-between">
                   <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded flex items-center justify-center shrink-0">
                         <FaBookOpen size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                      </div>
                      <div>
                         <h4 className="text-md md:text-lg font-bold text-slate-900 leading-tight transition-colors">{session.topic}</h4>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{session.category.replace('-', ' ')}</span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${
                               session.difficulty === 'hard' ? 'text-rose-500' : 
                               session.difficulty === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                            }`}>{session.difficulty}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900 tracking-tighter">{session.score}%</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-end gap-1.5">
                         <FaClock size={10} />
                         {session.timeSpent} MIN
                      </p>
                   </div>
                </div>
              ))}

              {sessions.length === 0 && (
                <div className="bg-white border border-slate-200 shadow-sm rounded py-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded flex items-center justify-center mx-auto mb-4">
                    <FaBookOpen size={24} />
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No practice sessions found</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Premium Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4">
          <div className="relative w-full max-w-2xl bg-white rounded shadow-sm overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="relative px-6 md:px-8 py-6 bg-slate-50 border-b border-slate-200">
               <div className="flex justify-between items-center relative z-10">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight">Log Session</h3>
                     <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Record your practice performance</p>
                  </div>
                  <button 
                    onClick={() => setShowForm(false)} 
                    className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
                  >
                     <FaTimes size={14} />
                  </button>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Focus Topic</label>
                  <div className="relative">
                     <FaBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                     <input
                        type="text"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-colors"
                        placeholder="e.g. Advanced Graph Algorithms"
                        required
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Domain Category</label>
                     <div className="relative">
                        <select
                           name="category"
                           value={formData.category}
                           onChange={handleInputChange}
                           className="w-full bg-white border border-slate-200 rounded px-4 py-3 text-sm font-bold text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-colors appearance-none cursor-pointer"
                        >
                           {categories.slice(1).map(cat => (
                           <option key={cat.value} value={cat.value}>{cat.label}</option>
                           ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <FaFilter size={12} />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Complexity Level</label>
                     <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-1 rounded">
                        {['easy', 'medium', 'hard'].map((level) => (
                           <button
                              key={level}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                              className={`py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                 formData.difficulty === level
                                 ? level === 'easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                 : level === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                 : 'bg-rose-50 text-rose-700 border border-rose-200'
                                 : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-transparent'
                              }`}
                           >
                              {level}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Total Questions</label>
                     <div className="relative">
                        <FaBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                           type="number"
                           name="totalQuestions"
                           value={formData.totalQuestions}
                           onChange={handleInputChange}
                           className="w-full bg-white border border-slate-200 rounded pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-colors"
                           placeholder="20"
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Correct Answers</label>
                     <div className="relative">
                        <FaTrophy className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                           type="number"
                           name="correctAnswers"
                           value={formData.correctAnswers}
                           onChange={handleInputChange}
                           className="w-full bg-white border border-slate-200 rounded pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-colors"
                           placeholder="18"
                           required
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Accuracy Score %</label>
                     <div className="relative">
                        <FaChartBar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                           type="number"
                           name="score"
                           value={formData.score}
                           onChange={handleInputChange}
                           min="0"
                           max="100"
                           className="w-full bg-slate-50 border border-slate-200 rounded pl-12 pr-4 py-3 text-sm font-bold text-slate-500 focus:ring-0 cursor-not-allowed"
                           placeholder="Calculated automatically"
                           readOnly
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Time Dedicated (Min)</label>
                     <div className="relative">
                        <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                           type="number"
                           name="timeSpent"
                           value={formData.timeSpent}
                           onChange={handleInputChange}
                           className="w-full bg-white border border-slate-200 rounded pl-12 pr-4 py-3 text-sm font-bold text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-colors"
                           placeholder="45"
                           required
                        />
                     </div>
                  </div>
               </div>

               <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded font-bold uppercase tracking-widest text-xs shadow-sm hover:bg-slate-800 transition-colors mt-6"
               >
                  Verify & Log Session
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeHub;
