import React from 'react';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Trophy, 
  ArrowUp,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  PieChart as PieIcon,
  ChevronRight,
  Plus,
  Settings
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const DashboardOverview = () => {
  const dashboardStats = [
    { 
      label: 'Total Jobs Posted', 
      value: '23', 
      change: '+15%', 
      icon: Briefcase, 
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-200'
    },
    { 
      label: 'Applications Received', 
      value: '847', 
      change: '+22%', 
      icon: Users, 
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-200'
    },
    { 
      label: 'Shortlisted', 
      value: '156', 
      change: '+8%', 
      icon: CheckCircle, 
      gradient: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-200'
    },
    { 
      label: 'Offers Released', 
      value: '47', 
      change: '+12%', 
      icon: Trophy, 
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-200'
    }
  ];

  const applicationTrends = [
    { month: 'Jan', applications: 120 },
    { month: 'Feb', applications: 135 },
    { month: 'Mar', applications: 148 },
    { month: 'Apr', applications: 162 },
    { month: 'May', applications: 178 },
    { month: 'Jun', applications: 195 }
  ];

  const statusDistribution = [
    { name: 'Applied', value: 60, color: '#3B82F6' },
    { name: 'Shortlisted', value: 25, color: '#10B981' },
    { name: 'Interview', value: 15, color: '#F59E0B' },
    { name: 'Offered', value: 10, color: '#8B5CF6' },
    { name: 'Rejected', value: 5, color: '#EF4444' }
  ];

  const recentApplications = [
    { name: 'Priya Sharma', role: 'Software Engineer', time: '2 min ago', status: 'New', avatar: 'PS' },
    { name: 'Arjun Patel', role: 'Data Analyst', time: '15 min ago', status: 'New', avatar: 'AP' },
    { name: 'Kavya Reddy', role: 'Product Manager', time: '1 hour ago', status: 'Viewed', avatar: 'KR' },
    { name: 'Rahul Kumar', role: 'Frontend Developer', time: '2 hours ago', status: 'Viewed', avatar: 'RK' }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Recruitment Console</h1>
          <p className="text-gray-500 font-medium">Global talent acquisition status and metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
            <Calendar size={16} />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all font-bold text-sm">
            <Plus size={16} />
            Post New Job
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group glass-card p-6 rounded-[2rem] hover-lift border-white/50 relative overflow-hidden">
               <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-full`}></div>
               
               <div className="flex flex-col gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  
                  <div>
                    <h4 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                    <TrendingUp size={12} />
                    {stat.change}
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Trends */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              Engagement Velocity
            </h3>
            <button className="text-sm font-bold text-blue-600 hover:underline">Detailed Report</button>
          </div>
          
          <div className="glass-card rounded-[2.5rem] p-8 min-h-[400px]">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={applicationTrends}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#3B82F6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorApps)" 
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Talent Source Distribution */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 px-2">
            <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
            Conversion Funnel
          </h3>
          
          <div className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center min-h-[400px]">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="w-full mt-6 space-y-3">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-bold text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Applicant Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Applicant Live Feed
            </h3>
            <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="glass-card rounded-[2.5rem] p-4 space-y-3">
            {recentApplications.map((app, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-black text-sm group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500">
                    {app.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{app.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{app.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    app.status === 'New' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {app.status}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 opacity-60">{app.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Console */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 px-2">
            <Settings size={20} className="text-indigo-600" />
            Operations Console
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Job Board', desc: 'Create & manage active roles', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Talent Pool', desc: 'Review pending applications', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
              { title: 'Interviews', desc: 'Coordinate meeting syncs', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Offer Lab', desc: 'Release employment contracts', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' }
            ].map((action, i) => (
              <button key={i} className="flex items-start gap-4 p-6 glass-card rounded-[2.5rem] hover:bg-gray-50/50 transition-all group text-left">
                <div className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <action.icon size={20} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 tracking-tight uppercase text-xs">{action.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{action.desc}</p>
                </div>
              </button>
            ))}
            
            <div className="sm:col-span-2 p-8 bg-gradient-to-br from-gray-900 to-slate-800 rounded-[2.5rem] relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-200">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <h4 className="text-xl font-bold text-white mb-2">Recruitment Analytics</h4>
                  <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">System-generated reports on hire velocity and source quality.</p>
                  <button className="flex items-center gap-2 text-blue-400 font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
                    Access Intelligence Suite
                    <ChevronRight size={14} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
