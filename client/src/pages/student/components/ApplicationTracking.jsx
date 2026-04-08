import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  History, 
  LifeBuoy,
  MousePointer2,
  ShieldCheck,
  Zap,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const ApplicationTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getApplicationById(id);
      if (res.success) {
        setApplication(res.data);
      }
    } catch (err) {
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'applied': { 
        label: 'Application Received', 
        color: 'text-blue-500', 
        bg: 'bg-blue-50', 
        border: 'border-blue-100',
        description: 'Your application has been successfully transmitted to the company vault.' 
      },
      'test_scheduled': { 
        label: 'Assessment Phase', 
        color: 'text-amber-500', 
        bg: 'bg-amber-50', 
        border: 'border-amber-100',
        description: 'Technical assessment or aptitude test has been scheduled.' 
      },
      'test_completed': { 
        label: 'Evaluation in Progress', 
        color: 'text-orange-500', 
        bg: 'bg-orange-50', 
        border: 'border-orange-100',
        description: 'Your test results are currently under internal review.' 
      },
      'interview_scheduled': { 
        label: 'Interview Phase', 
        color: 'text-purple-500', 
        bg: 'bg-purple-50', 
        border: 'border-purple-100',
        description: 'Expert interviews have been coordinated with the hiring team.' 
      },
      'interview_completed': { 
        label: 'Final Deliberation', 
        color: 'text-indigo-500', 
        bg: 'bg-indigo-50', 
        border: 'border-indigo-100',
        description: 'Interview rounds completed. Awaiting final decision.' 
      },
      'offer_received': { 
        label: 'Offer Generated', 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-100',
        description: 'Congratulations! An offer has been issued for this position.' 
      },
      'rejected': { 
        label: 'Process Concluded', 
        color: 'text-rose-500', 
        bg: 'bg-rose-50', 
        border: 'border-rose-100',
        description: 'The application process for this position has ended.' 
      },
      'withdrawn': { 
        label: 'Mission Aborted', 
        color: 'text-slate-500', 
        bg: 'bg-slate-50', 
        border: 'border-slate-100',
        description: 'This application was voluntarily withdrawn from the process.' 
      }
    };
    return configs[status] || configs['applied'];
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Loader2 className="w-12 h-12 text-slate-900 animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Status...</p>
    </div>
  );

  if (!application) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 mb-2">Vault Entry Not Found</h3>
      <button onClick={() => navigate(-1)} className="text-blue-600 font-bold flex items-center gap-2">
        <ArrowLeft size={16} /> Return to Applications
      </button>
    </div>
  );

  const statusInfo = getStatusConfig(application.status);

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold uppercase tracking-widest text-[10px]"
      >
        <div className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
          <ArrowLeft size={14} />
        </div>
        Back to Applications
      </button>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Core Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <div className="relative overflow-hidden bg-slate-900 rounded p-8 md:p-12 text-white border border-slate-800 shadow-xl">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>

             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center backdrop-blur-xl shadow-inner">
                         <Building2 className="text-white w-7 h-7" />
                      </div>
                      <div>
                         <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            {application.role}
                         </h1>
                         <p className="text-blue-400 font-bold text-lg tracking-tight uppercase">{application.company}</p>
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                         <MapPin size={16} className="text-white/40" />
                         <span className="text-sm font-bold text-white/80">{application.location || 'Multiple Nodes'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Briefcase size={16} className="text-white/40" />
                         <span className="text-sm font-bold text-white/80 uppercase tracking-widest">{application.type?.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <DollarSign size={16} className="text-white/40" />
                         <span className="text-sm font-black text-emerald-400">{application.salary}</span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                   <div className={`px-4 py-2 rounded border-2 ${statusInfo.border.replace('blue', 'white/20')} backdrop-blur-xl shadow-lg flex items-center gap-2`}>
                      <ShieldCheck size={18} className="text-blue-400" />
                      <span className="font-black uppercase tracking-[0.2em] text-xs">{application.status?.replace('_', ' ')}</span>
                   </div>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Applied on {application.appliedDate}</p>
                </div>
             </div>
          </div>

          {/* Details Section */}
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                   <FileText size={14} className="text-blue-600" />
                   Position Intelligence
                </h3>
             </div>
             <div className="p-8 space-y-10">
                <div className="space-y-4">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Requirement Overview</h4>
                   <p className="text-slate-700 text-sm leading-relaxed font-medium whitespace-pre-line">
                      {application.description || 'Access restricted. Original brief was utilized for this mission.'}
                   </p>
                </div>

                {application.skills?.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Arsenal Required</h4>
                     <div className="flex flex-wrap gap-2">
                        {application.skills.map(skill => (
                           <span key={skill} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-black uppercase tracking-widest">
                              {skill}
                           </span>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </div>

        </div>

        {/* Right Column: Live Status & Tracking */}
        <div className="space-y-8">
           
           {/* Current Status Visualization */}
           <div className={`rounded p-8 border ${statusInfo.border} ${statusInfo.bg} shadow-sm relative overflow-hidden group`}>
              <div className="absolute -top-4 -right-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                 <Zap size={120} />
              </div>
              <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${statusInfo.color}`}>Current Lifecycle</h3>
              <div className="space-y-4 relative z-10">
                 <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight">
                    {application.timeline?.length > 0 ? application.timeline[application.timeline.length - 1].action : statusInfo.label}
                 </h4>
                 <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    {application.timeline?.length > 0 ? application.timeline[application.timeline.length - 1].description : statusInfo.description}
                 </p>
              </div>
           </div>


        </div>

      </div>
    </div>
  );
};

export default ApplicationTracking;
