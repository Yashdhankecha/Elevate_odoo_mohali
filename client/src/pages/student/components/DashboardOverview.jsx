import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  BarChart3, 
  Briefcase, 
  History,
  Trophy,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  Sparkles,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Loader2,
  Newspaper,
  ExternalLink,
  Search
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useNewsData } from '../../../hooks/useNewsData';

const Typewriter = ({ text, delay = 70 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset if text changes
    setCurrentText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className="inline-block relative">
      {currentText}
      <span className="inline-block w-[3px] h-[0.9em] bg-blue-600 ml-1 animate-pulse align-middle" />
    </span>
  );
};

const DashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles: news, loading: newsLoading, error: newsError, loadMore, loadingMore, hasMore } = useNewsData();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Let's start a beautiful morning,";
    if (hour < 17) return "Good afternoon,";
    if (hour < 23) return "Good evening,";
    return "Hello night owl,";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
    </div>
  );

  if (!dashboardData) return (
    <div className="bg-white rounded border border-slate-200 p-8 md:p-16 text-center max-w-xl mx-auto mt-10 md:mt-20 shadow-sm flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 rounded flex items-center justify-center mb-6 md:mb-8 border border-rose-100 shadow-sm">
        <Target size={32} className="text-rose-500" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Error Connecting</h3>
      <p className="text-slate-500 text-sm font-medium mb-8 md:mb-10 leading-relaxed max-w-md">We couldn't connect to the server. Please check your internet connection.</p>
      <button onClick={fetchDashboardData} className="w-full md:w-auto px-10 md:px-12 py-3 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors shadow-sm">Try Again</button>
    </div>
  );

  const { student: studentProfile, stats, recentActivities } = dashboardData;

  const metrics = [
    { title: 'Applications', value: stats.applicationsSubmitted, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Submitted' },
    { title: 'Practice Sessions', value: stats.practiceSessions, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Active' },
    { title: 'Skills Mastered', value: stats.skillsMastered, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Completed' },
    { title: 'Test Score', value: `${stats.averageTestScore}%`, icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Average' },
    { title: 'Interviews', value: stats.interviewsScheduled, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Scheduled' },
    { title: 'Profile Completion', value: `${stats.profileCompletion}%`, icon: CheckCircle2, color: 'text-cyan-600', bg: 'bg-cyan-50', trend: 'Status' }
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      {/* Welcome Area - Updated to Plain Style with Typewriter */}
      <div className="py-2 md:py-6">
         <div className="flex flex-col gap-6">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight min-h-[1.2em]">
               <Typewriter text={`${getGreeting()} ${studentProfile?.name ? studentProfile.name.split(' ')[0] : 'Student'}`} />
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-3">
               <button onClick={() => navigate('/student-dashboard/resume-builder')} className="px-6 py-2.5 bg-slate-900 text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-sm">
                  Manage Resume <ArrowUpRight size={14} />
               </button>
               <button onClick={() => navigate('/student-dashboard/ai-coach')} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-sm">
                  Ask AI Coach <Sparkles size={14} className="text-blue-500" />
               </button>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-8">
         <div className="flex items-end justify-between px-6">
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">My Progress</h2>
               <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Live statistics and metrics</p>
            </div>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            {metrics.map((metric, i) => (
               <div key={i} className="bg-white p-4 md:p-6 rounded border border-slate-200 shadow-sm transition-colors hover:border-slate-300 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded ${metric.bg} ${metric.color} flex items-center justify-center`}>
                     <metric.icon size={22} />
                  </div>
                  
                  <div className="mt-4 space-y-1">
                     <h4 className="text-2xl font-bold text-slate-900 leading-none">{metric.value}</h4>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{metric.title}</p>
                  </div>
                  
                  <div className="mt-4 px-3 py-1 bg-slate-50 border border-slate-100 rounded flex items-center gap-1.5">
                     <span className={`text-[9px] font-bold uppercase tracking-widest ${metric.color}`}>{metric.trend}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Full Width News Section */}
      <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end px-6 gap-4">
              <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                      <Zap className="text-blue-600" fill="currentColor" size={24} />
                      The Tech Pulse
                  </h3>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Curated placements, hiring & tech news</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter news titles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow bg-white shadow-sm"
                />
              </div>
          </div>
          
          <div className="bg-white rounded border border-slate-200 shadow-sm p-6 md:p-10 relative overflow-hidden min-h-[400px]">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              {newsLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center relative z-10 h-full">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
                          <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Curating your newsfeed...</p>
                  </div>
              ) : news.length > 0 ? (
                  <div className="flex flex-col gap-4 relative z-10">
                      {news
                          .filter(item => (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item, idx) => (
                          <a
                              key={idx}
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex flex-col sm:flex-row rounded border border-slate-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 bg-white transition-all overflow-hidden items-stretch"
                          >
                              {item.image_url ? (
                                  <div className="relative bg-slate-100 overflow-hidden w-full sm:w-48 h-48 sm:h-auto shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100">
                                      <img src={item.image_url} alt="News thumbnail" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" />
                                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </div>
                              ) : (
                                  <div className="bg-slate-50 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden w-full sm:w-48 h-48 sm:h-auto shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100">
                                      <Newspaper size={32} className="mb-2 opacity-30" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Image</span>
                                  </div>
                              )}
                              
                              <div className="flex flex-col flex-1 p-5">
                                  <div className="flex items-center gap-2 mb-2">
                                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors truncate max-w-[150px]">
                                          {item.source_id || 'Industry News'}
                                      </span>
                                  </div>
                                  <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                      {item.title}
                                  </h4>
                                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                      {item.description || 'Discover the latest insights and updates from this top tech story.'}
                                  </p>
                                  
                                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">Read Full Story</span>
                                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors text-slate-400">
                                          <ArrowUpRight size={12} />
                                      </div>
                                  </div>
                              </div>
                          </a>
                      ))}
                      
                      {news.filter(item => (item.title || "").toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && !newsLoading && (
                          <div className="py-12 text-center">
                              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No articles match your search.</p>
                          </div>
                      )}
                      
                      {/* Load More Button */}
                      {hasMore && news.filter(item => (item.title || "").toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
                          <div className="flex justify-center mt-4">
                              <button 
                                  onClick={loadMore}
                                  disabled={loadingMore}
                                  className="px-6 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs uppercase tracking-widest rounded-full transition-colors flex items-center gap-2"
                              >
                                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More News'}
                              </button>
                          </div>
                      )}
                  </div>
              ) : (
                 <div className="py-20 flex flex-col items-center justify-center text-center relative z-10">
                     <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                         <Rocket size={32} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 mb-2">No Updates Found</h3>
                     <p className="text-[12px] font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">{newsError || 'Check back later for curated news on tech placements and hiring opportunities.'}</p>
                 </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
