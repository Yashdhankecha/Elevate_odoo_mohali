import React, { useState, useEffect } from 'react';
import { 
  FaBuilding,
  FaHistory
} from 'react-icons/fa';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

const PlacementHistory = () => {
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacementHistory();
  }, []);

  const fetchPlacementHistory = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getPlacementHistory();
      setPlacementData(response.data);
    } catch (error) {
      console.error('Error fetching placement history:', error);
      toast.error('Failed to load placement history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="w-16 h-16 border-4 border-slate-50 flex items-center justify-center rounded-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-slate-800 animate-grow h-1 origin-bottom"></div>
           <FaHistory className="text-slate-300 animate-pulse" size={24} />
        </div>
        <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Historical Archives</p>
      </div>
    );
  }

  const { companyTimeline } = placementData;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="px-2">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Placement Chronicle</h2>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1 italic">The trajectory of your professional evolution</p>
      </div>

      {/* Main Timeline Context */}
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8 relative">
          {/* Vertical line for the timeline */}
          <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-100 to-transparent hidden md:block"></div>

          {companyTimeline && companyTimeline.length > 0 ? (
            companyTimeline.map((company, idx) => (
              <div key={company.id || idx} className="relative md:pl-20 group">
                {/* Timeline Dot */}
                <div className="absolute left-[-2px] md:left-[36px] top-8 w-2 h-2 rounded-full bg-white ring-4 ring-gray-100 group-hover:ring-blue-100 group-hover:bg-blue-600 transition-all duration-300 z-10 hidden md:block"></div>

                <div className="glass-card p-8 rounded-[2.5rem] border-white/50 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500 hover-lift">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {company.logo || <FaBuilding size={24} />}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-gray-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{company.company || 'Professional Partner'}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{company.role || 'Career Position'}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      company.status?.label === 'Offered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {company.status?.label || 'In Process'}
                    </div>
                  </div>

                  {/* Horizontal Timeline Steps */}
                  <div className="relative pl-4 border-l-2 border-gray-50 space-y-6">
                    {company.timeline && company.timeline.map((step, sIdx) => (
                      <div key={sIdx} className="relative pl-6">
                        <div className={`absolute left-[-9px] top-1.5 w-4 h-4 rounded-full border-2 border-white transition-colors ${
                          step.status === 'completed' ? 'bg-emerald-500' : 
                          step.status === 'scheduled' ? 'bg-amber-400' : 'bg-gray-200'
                        }`}></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                           <div>
                              <p className="text-sm font-black text-gray-700">{step.step}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.date}</p>
                           </div>
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                             step.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                             step.status === 'scheduled' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                           }`}>
                             {step.status}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {company.offerDetails && (
                    <div className="mt-8 p-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                       <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                          <FaHistory size={80} />
                       </div>
                       <div className="relative z-10 flex items-center justify-between">
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Compensation Package</p>
                             <h5 className="text-lg font-black">{company.offerDetails}</h5>
                          </div>
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                             <FaBuilding />
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card rounded-[2.5rem] py-32 text-center md:ml-20 border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FaHistory size={40} />
               </div>
               <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Chronicle Empty</h3>
               <p className="text-sm text-gray-300 font-bold mt-2">Your professional trajectory will materialize here</p>
            </div>
          )}
        </div>

        {/* Sidebar Info - Performance Context */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8 rounded-[2.5rem] border-white/50 bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                 <h3 className="text-xl font-black uppercase tracking-tight mb-2">Portfolio Insights</h3>
                 <p className="text-xs text-indigo-100 font-medium opacity-80 mb-8 leading-relaxed">System-generated summary of your placement velocity and success rate.</p>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Conversion Rate</p>
                       <span className="text-2xl font-black">78%</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Market Value</p>
                       <span className="text-2xl font-black">High</span>
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Avg Response</p>
                       <span className="text-2xl font-black">3.2d</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-8 rounded-[2.5rem] border-white/50 bg-white shadow-xl shadow-gray-200/50">
              <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                 Quick Support
              </h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 italic">Need help with an ongoing application? Contact your placement coordinator through the AI Coach.</p>
              <button className="w-full py-4 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300">
                 Access AI Command
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementHistory;
