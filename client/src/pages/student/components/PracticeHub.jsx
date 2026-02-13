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
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all duration-300 font-bold uppercase tracking-widest text-[11px] flex items-center gap-3 group"
        >
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
             <FaPlus size={12} />
          </div>
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
           <div key={i} className="glass-card p-6 rounded-[2rem] hover-lift relative overflow-hidden border-white/50">
              <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${s.color} opacity-5 rounded-full`}></div>
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}>
                    <s.icon size={18} />
                 </div>
                 <div>
                    <p className="text-2xl font-black text-gray-800">{s.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                 </div>
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
                     className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                       filter === cat.value 
                         ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                         : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-200 hover:text-indigo-600'
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
                   <div key={idx} className="glass-card p-5 rounded-3xl border-white/50 group hover:border-indigo-100 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                         <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">{stat.category.replace('-', ' ')}</p>
                         <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{stat.count} Sessions</span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div 
                           className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000"
                           style={{ width: `${stat.averageScore}%` }}
                         ></div>
                      </div>
                      <div className="flex justify-between mt-2">
                         <span className="text-[10px] font-bold text-gray-400 uppercase">Avg Score</span>
                         <span className="text-[10px] font-black text-gray-800 uppercase">{stat.averageScore}%</span>
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
                <div key={idx} className="glass-card group p-6 rounded-[2.2rem] border-white/50 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-200/20 transition-all duration-500 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                         <FaBookOpen size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                         <h4 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors">{session.topic}</h4>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{session.category.replace('-', ' ')}</span>
                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${
                               session.difficulty === 'hard' ? 'text-rose-500' : 
                               session.difficulty === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                            }`}>{session.difficulty}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-gray-800 tracking-tighter">{session.score}%</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-end gap-1.5">
                         <FaClock size={10} />
                         {session.timeSpent} MIN
                      </p>
                   </div>
                </div>
              ))}

              {sessions.length === 0 && (
                <div className="glass-card rounded-[2.5rem] py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <FaBookOpen size={32} />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No practice sessions found</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Premium Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
            
            {/* Modal Header with decorative background */}
            <div className="relative px-8 py-6 bg-gradient-to-br from-indigo-600 to-blue-600">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
               <div className="flex justify-between items-center relative z-10">
                  <div>
                     <h3 className="text-2xl font-black text-white tracking-tight uppercase">Log Session</h3>
                     <p className="text-indigo-100/80 font-bold text-[10px] uppercase tracking-widest mt-1">Record your practice performance</p>
                  </div>
                  <button 
                    onClick={() => setShowForm(false)} 
                    className="w-10 h-10 rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                  >
                     <FaTimes size={16} />
                  </button>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Focus Topic</label>
                  <div className="relative group">
                     <FaBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                     <input
                        type="text"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                        placeholder="e.g. Advanced Graph Algorithms"
                        required
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Domain Category</label>
                     <div className="relative group">
                        <select
                           name="category"
                           value={formData.category}
                           onChange={handleInputChange}
                           className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                           {categories.slice(1).map(cat => (
                           <option key={cat.value} value={cat.value}>{cat.label}</option>
                           ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                           <FaFilter size={12} />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Complexity Level</label>
                     <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-2xl">
                        {['easy', 'medium', 'hard'].map((level) => (
                           <button
                              key={level}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                 formData.difficulty === level
                                 ? level === 'easy' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                 : level === 'medium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                                 : 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                                 : 'text-gray-400 hover:bg-gray-200/50'
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
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Total Questions</label>
                     <div className="relative group">
                        <FaBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                        <input
                           type="number"
                           name="totalQuestions"
                           value={formData.totalQuestions}
                           onChange={handleInputChange}
                           className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                           placeholder="20"
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Correct Answers</label>
                     <div className="relative group">
                        <FaTrophy className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                        <input
                           type="number"
                           name="correctAnswers"
                           value={formData.correctAnswers}
                           onChange={handleInputChange}
                           className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                           placeholder="18"
                           required
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Accuracy Score %</label>
                     <div className="relative group">
                        <FaChartBar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                        <input
                           type="number"
                           name="score"
                           value={formData.score}
                           onChange={handleInputChange}
                           min="0"
                           max="100"
                           className="w-full bg-gray-100 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-500 focus:ring-0 cursor-not-allowed"
                           placeholder="Calculated automatically"
                           readOnly
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Time Dedicated (Min)</label>
                     <div className="relative group">
                        <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                        <input
                           type="number"
                           name="timeSpent"
                           value={formData.timeSpent}
                           onChange={handleInputChange}
                           className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                           placeholder="45"
                           required
                        />
                     </div>
                  </div>
               </div>

               <button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 mt-6"
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
