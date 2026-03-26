import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, MapPin, Briefcase, Clock, Building2,
  X, ChevronRight, ChevronLeft, Send, GraduationCap,
  CheckCircle2, AlertCircle, BookOpen, Code2, Users, Calendar,
  DollarSign, Globe, Wifi, Monitor, Star, TrendingUp, Award,
  ExternalLink, Phone, Mail, RefreshCw, XCircle, Eye, Layers, File
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

// ─── Helpers ────────────────────────────────────────────────────────────────
const timeAgo = (date) => {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date)) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
};

const fmtDeadline = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const diff = Math.ceil((d - Date.now()) / 86400000);
  if (diff < 0) return { label: 'Expired', cls: 'text-red-500' };
  if (diff <= 3) return { label: `${diff}d left!`, cls: 'text-orange-500 font-bold' };
  if (diff <= 7) return { label: `${diff}d left`, cls: 'text-amber-500' };
  return { label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), cls: 'text-slate-400' };
};

const DRIVE = {
  on_campus:  { label: 'On-Campus',  cls: 'bg-violet-50 text-violet-700 border-violet-200' },
  off_campus: { label: 'Off-Campus', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
};
const WORK_ICON = { remote: Wifi, office: Monitor, hybrid: Globe };

const initials = (n = '') => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'CO';
const GRAD = ['from-blue-500 to-indigo-600','from-violet-500 to-purple-600','from-teal-500 to-emerald-600','from-rose-500 to-pink-600','from-amber-500 to-orange-600'];
const grad = (name) => GRAD[(name || '').charCodeAt(0) % GRAD.length];

// ─── Company Avatar ──────────────────────────────────────────────────────────
const Avatar = ({ name, logo, size = 'md' }) => {
  const [error, setError] = useState(false);
  const sz = size === 'lg' ? 'w-16 h-16 rounded text-xl' : 'w-11 h-11 rounded text-sm';
  
  if (logo && !error) {
    return (
      <img 
        src={logo} 
        alt={name || 'Company'} 
        className={`${sz} object-contain bg-white flex-shrink-0 shadow-sm border border-slate-100 p-1`} 
        onError={() => setError(true)}
      />
    );
  }
  
  return (
    <div className={`${sz} bg-gradient-to-br ${grad(name)} flex items-center justify-center text-white font-black shadow-sm flex-shrink-0 capitalize`}>
      {initials(name)}
    </div>
  );
};

// ─── Job Card ────────────────────────────────────────────────────────────────
const ACCENT_COLORS = [
  { bar: 'bg-blue-500',   pill: 'bg-blue-50 text-blue-700 border-blue-200',   salary: 'text-blue-700 bg-blue-50 border-blue-200' },
  { bar: 'bg-violet-500', pill: 'bg-violet-50 text-violet-700 border-violet-200', salary: 'text-violet-700 bg-violet-50 border-violet-200' },
  { bar: 'bg-emerald-500',pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', salary: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { bar: 'bg-rose-500',   pill: 'bg-rose-50 text-rose-700 border-rose-200',   salary: 'text-rose-700 bg-rose-50 border-rose-200' },
  { bar: 'bg-amber-500',  pill: 'bg-amber-50 text-amber-700 border-amber-200', salary: 'text-amber-700 bg-amber-50 border-amber-200' },
];
const getAccent = (name = '') => ACCENT_COLORS[(name.charCodeAt(0) || 0) % ACCENT_COLORS.length];

const JobCard = ({ job, onView }) => {
  const deadline = fmtDeadline(job.deadline || job.applicationDeadline);
  const drive    = DRIVE[job.driveType] || DRIVE.off_campus;
  const accent   = getAccent(job.company);
  const WorkIcon = WORK_ICON[job.workMode] || Globe;
  const salary   = job.salary || (job.ctc ? `₹${(job.ctc / 100000).toFixed(1)} LPA` : null) || (job.stipend ? `₹${Number(job.stipend).toLocaleString()}/mo` : null) || 'Competitive';

  return (
    <div
      onClick={() => onView(job)}
      className="group bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden relative"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${accent.bar} transition-all duration-300 group-hover:h-1.5`} />

      {/* Applied badge */}
      {job.hasApplied && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
          <CheckCircle2 size={9} /> Applied
        </div>
      )}

      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0">
            <Avatar name={job.company} logo={job.companyLogo} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {job.title || job.jobTitle}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
              <Building2 size={11} className="text-slate-400 flex-shrink-0" />
              <span className="line-clamp-1 font-medium">{job.company}</span>
            </div>
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-[9px] font-black px-2.5 py-1 rounded border tracking-widest uppercase ${drive.cls}`}>
            {drive.label}
          </span>
          {job.workMode && (
            <span className="text-[9px] font-bold px-2.5 py-1 rounded bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-widest flex items-center gap-1">
              <WorkIcon size={9} /> {job.workMode}
            </span>
          )}
          {(job.employmentType || job.type) && (
            <span className="text-[9px] font-bold px-2.5 py-1 rounded bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-widest capitalize">
              {job.employmentType || job.type}
            </span>
          )}
        </div>

        {/* Location */}
        {job.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
            <MapPin size={11} className="text-slate-400 flex-shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
        )}

        {/* Salary highlight */}
        <div className={`w-full text-center py-2.5 rounded border text-sm font-black mb-4 ${accent.salary} tracking-tight`}>
          {salary}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <Users size={11} />
            <span>{job.applicationCount || 0} applied</span>
          </div>
          <div className="flex items-center gap-2">
            {deadline && (
              <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${deadline.cls}`}>
                <Clock size={9} /> {deadline.label}
              </span>
            )}
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white ${accent.bar} px-2.5 py-1 rounded-full shadow-sm group-hover:scale-105 transition-transform`}>
              View <ChevronRight size={10} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Subcomponents for modal ─────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm">
        <Icon size={14} className="text-slate-600" />
      </div>
      <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-[0.2em]">{title}</h4>
    </div>
    <div className="pl-11">
      {children}
    </div>
  </div>
);

const Chip = ({ label, value, highlight }) => (
  <div className={`rounded p-4 border transition-colors ${
    highlight 
      ? 'bg-emerald-50 border-emerald-200' 
      : 'bg-slate-50 border-slate-200 shadow-sm'
  }`}>
    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-bold tracking-tight ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}>{value}</p>
  </div>
);

const Tag = ({ label, color = 'slate' }) => {
  const C = { 
    slate: 'bg-slate-100 text-slate-700 border-slate-200', 
    violet: 'bg-violet-50 text-violet-700 border-violet-200', 
    amber: 'bg-amber-50 text-amber-700 border-amber-200', 
    teal: 'bg-teal-50 text-teal-700 border-teal-200', 
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200'
  };
  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded border uppercase tracking-widest shadow-sm ${C[color] || C.slate}`}>
      {label}
    </span>
  );
};

// ─── Job Detail Modal ────────────────────────────────────────────────────────
const JobDetailModal = ({ job, onClose, onApply }) => {
  const [tab, setTab] = useState('overview');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const { user } = useAuth();
  const [useProfileResume, setUseProfileResume] = useState(!!user?.resume);

  if (!job) return null;

  const deadline = fmtDeadline(job.deadline);
  const drive    = DRIVE[job.driveType] || DRIVE.off_campus;

  // True when student has a usable resume
  const hasResume = !!(user?.resume || resumeFile);
  const noResumeSelected = !useProfileResume && !resumeFile;

  const handleApply = async () => {
    // Hard block — resume is mandatory
    if (!hasResume || noResumeSelected) {
      toast.error('A resume is required to apply. Please upload one or save a resume to your profile first.');
      setTab('apply');
      return;
    }

    setApplying(true);
    try {
      await onApply({
        ...job,
        coverLetter,
        resume: useProfileResume ? null : resumeFile // null tells backend to use profile resume
      });
      setApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Application failed:', error);
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);

      if (error.response?.data?.issues) {
        setTab('eligibility');
      }
    }
    setApplying(false);
  };

  const TABS = [
    { id: 'overview',    label: 'Overview',    icon: Briefcase },
    { id: 'eligibility', label: 'Eligibility', icon: Award },
    { id: 'process',     label: 'Process',     icon: TrendingUp },
    { id: 'apply',       label: 'Apply',       icon: Send },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-sm sm:rounded border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="relative bg-slate-900 p-5 sm:p-6 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded bg-white/10 hover:bg-white/20 border border-slate-700 flex items-center justify-center transition-colors text-white z-10">
            <X size={15} />
          </button>
          <div className="flex gap-4 items-start pr-10">
            <Avatar name={job.company} logo={job.companyLogo} size="lg" />
            <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${drive.cls}`}>{drive.label}</span>
                {job.jobType && <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">{job.jobType}</span>}
                {job.eligibility && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-0.5 ${job.eligibility.eligible ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-red-500/20 text-red-300 border-red-400/30'}`}>
                    {job.eligibility.eligible ? <CheckCircle2 size={8} /> : <XCircle size={8} />}
                    {job.eligibility.eligible ? 'You\'re eligible' : 'Not eligible'}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">{job.title}</h2>
              <p className="text-blue-200 text-sm mt-1">{job.company}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-emerald-300 font-bold"><DollarSign size={11} className="text-emerald-400" />{job.salary}</span>
                {job.location && <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>}
                {deadline && <span className={`flex items-center gap-1 w-full sm:w-auto ${deadline.cls}`}><Calendar size={10} />{deadline.label}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 flex-shrink-0">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-bold transition-all border-b-2 ${tab === t.id ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <Icon size={12} />{t.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* === OVERVIEW === */}
          {tab === 'overview' && (
            <>
              {job.description && (
                <Section title="Role Description" icon={Briefcase}>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                </Section>
              )}

              {job.skills?.length > 0 && (
                <Section title="Required Skills" icon={Code2}>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map(s => <Tag key={s} label={s} color="blue" />)}
                  </div>
                </Section>
              )}

              <Section title="Compensation" icon={DollarSign}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <Chip label="Package / Stipend" value={job.salary} highlight />
                  {job.department && <Chip label="Department" value={job.department} />}
                  {job.experience && <Chip label="Experience" value={job.experience} />}
                </div>
                {job.benefits?.length > 0 && (
                  <p className="mt-3 text-sm text-slate-600 bg-emerald-50 rounded p-3 border border-emerald-200">
                    🎁 <span className="font-bold text-emerald-800">Perks:</span> {job.benefits.join(', ')}
                  </p>
                )}
              </Section>

              <Section title="Important Dates" icon={Calendar}>
                <div className="space-y-1">
                  {job.deadline && (
                    <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                      <span className="text-slate-500">Application Deadline</span>
                      <span className="font-bold text-slate-800">{new Date(job.deadline).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                  )}
                  {job.tentativeDriveDate && (
                    <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                      <span className="text-slate-500">Drive Date</span>
                      <span className="font-bold text-slate-800">{new Date(job.tentativeDriveDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                  )}
                </div>
              </Section>
            </>
          )}

          {/* === ELIGIBILITY === */}
          {tab === 'eligibility' && (
            <>
              {job.eligibility && (
                <div className={`rounded p-4 border ${job.eligibility.eligible ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {job.eligibility.eligible ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-orange-600" />}
                    <span className={`font-bold ${job.eligibility.eligible ? 'text-emerald-800' : 'text-orange-800'}`}>
                      {job.eligibility.eligible ? 'You meet all eligibility criteria!' : 'You may not meet some criteria'}
                    </span>
                  </div>
                  {job.eligibility.issues?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {job.eligibility.issues.map((issue, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-sm text-orange-700">
                          <XCircle size={12} /> {issue}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {job.eligibilityCriteria && (
                <Section title="Academic Criteria" icon={GraduationCap}>
                  <div className="grid grid-cols-2 gap-2">
                    {job.eligibilityCriteria.minCgpaPercentage?.value != null && (
                      <Chip label="Minimum CGPA" value={`≥ ${job.eligibilityCriteria.minCgpaPercentage.value}`} />
                    )}
                    <Chip
                      label="Backlogs"
                      value={job.eligibilityCriteria.backlogsAllowed ? `Max ${job.eligibilityCriteria.maxActiveBacklogs ?? 0}` : 'None allowed'}
                    />
                    <Chip
                      label="Gap Years"
                      value={job.eligibilityCriteria.gapYearsAllowed ? 'Allowed' : 'Not allowed'}
                    />
                  </div>
                </Section>
              )}

              {(job.eligibleBranches?.length > 0 || job.eligibleDegrees?.length > 0 || job.targetBatches?.length > 0) && (
                <Section title="Target Candidates" icon={BookOpen}>
                  {job.eligibleDegrees?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Degrees</p>
                      <div className="flex flex-wrap gap-1.5">{job.eligibleDegrees.map(d => <Tag key={d} label={d} />)}</div>
                    </div>
                  )}
                  {job.eligibleBranches?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Branches</p>
                      <div className="flex flex-wrap gap-1.5">{job.eligibleBranches.map(b => <Tag key={b} label={b} color="violet" />)}</div>
                    </div>
                  )}
                  {job.targetBatches?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Batches</p>
                      <div className="flex flex-wrap gap-1.5">{job.targetBatches.map(b => <Tag key={b} label={b} color="amber" />)}</div>
                    </div>
                  )}
                </Section>
              )}
            </>
          )}

          {/* === PROCESS === */}
          {tab === 'process' && (
            <>
              {job.selectionRounds?.length > 0 ? (
                <Section title="Selection Rounds" icon={TrendingUp}>
                  <div className="space-y-3">
                    {job.selectionRounds.map((r, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                          {r.roundNumber || i + 1}
                        </div>
                        <div className="flex-1 bg-white rounded p-3 border border-slate-200 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{r.roundName}</p>
                              <p className="text-xs text-slate-500 capitalize">{(r.roundType || '').replace(/_/g, ' ')}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {r.duration && <span className="text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-600">{r.duration}</span>}
                              {r.mode && <p className="text-[10px] text-slate-500 mt-1 capitalize">{r.mode}</p>}
                            </div>
                          </div>
                          {r.platform && <p className="text-xs text-slate-600 font-bold mt-2">📍 {r.platform}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : (
                <div className="text-center py-10 text-slate-500 text-sm">No process details available yet.</div>
              )}

              {job.pptRequired && job.pptDetails && (
                <Section title="Pre-Placement Talk" icon={Users}>
                  <div className="bg-violet-50 rounded p-4 border border-violet-200 grid grid-cols-1 gap-2">
                    {job.pptDetails.dateTime && <Chip label="Date & Time" value={new Date(job.pptDetails.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} />}
                    {job.pptDetails.duration && <Chip label="Duration" value={job.pptDetails.duration} />}
                    {job.pptDetails.venue && <Chip label="Venue" value={job.pptDetails.venue} />}
                  </div>
                </Section>
              )}
            </>
          )}

          {/* === APPLY === */}
          {tab === 'apply' && (
            <>
              {/* Eligibility warning if not eligible */}
              {job.eligibility && !job.eligibility.eligible && (
                <div className="bg-orange-50 border border-orange-200 rounded p-4 flex gap-3">
                  <AlertCircle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-orange-800 text-sm">You may not meet all criteria</p>
                    <ul className="text-xs text-orange-700 mt-1 space-y-0.5 list-disc list-inside">
                      {job.eligibility.issues.map((iss, i) => <li key={i}>{iss}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {/* ── Resume required warning ── */}
              {!user?.resume && !resumeFile && (
                <div className="bg-red-50 border border-red-200 rounded p-4 flex gap-3">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-800 text-sm">Resume required</p>
                    <p className="text-xs text-red-700 mt-0.5">You must attach a resume before submitting. Upload one below or save a resume to your profile.</p>
                  </div>
                </div>
              )}

              <Section title="Cover Letter" icon={Send}>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Tell the company why you're a great fit for this role..."
                  rows={4}
                  className="w-full text-sm border border-slate-200 rounded p-3 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 resize-none placeholder-slate-400"
                />
                <p className="text-[10px] text-slate-500 mt-1 font-bold">{coverLetter.length}/500 characters</p>
              </Section>

              <Section title="Resume" icon={File}>
                <div className="space-y-3">
                  {user?.resume && (
                    <label className="flex items-center gap-3 p-3 rounded border border-slate-200 bg-slate-50 cursor-pointer hover:bg-white transition-colors">
                      <input
                        type="checkbox"
                        checked={useProfileResume}
                        onChange={e => {
                          setUseProfileResume(e.target.checked);
                          if (e.target.checked) setResumeFile(null);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900">Use resume from profile</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{user.resume.split('/').pop()}</p>
                      </div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </label>
                  )}

                  <div className={`p-3 rounded border-2 border-dashed transition-colors ${!useProfileResume ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                    <input
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      disabled={useProfileResume}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setResumeFile(file);
                          setUseProfileResume(false);
                        }
                      }}
                    />
                    <label
                      htmlFor="resume-upload"
                      className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${useProfileResume ? 'cursor-not-allowed' : ''}`}
                    >
                      <Layers size={20} className={resumeFile ? 'text-blue-500' : 'text-slate-400'} />
                      <p className="text-xs font-bold text-slate-700">
                        {resumeFile ? resumeFile.name : 'Upload New Resume'}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">PDF, DOC up to 10MB</p>
                    </label>
                  </div>
                </div>
              </Section>

              {applied ? (
                <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold py-4 rounded text-sm">
                  <CheckCircle2 size={16} /> Application submitted successfully!
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying || (!hasResume || noResumeSelected)}
                  title={(!hasResume || noResumeSelected) ? 'Upload a resume to enable this button' : ''}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded transition-colors shadow-sm text-sm">
                  {applying ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const JobBrowse = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortBy, setSortBy] = useState('postedAt');
  const [driveType, setDriveType] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const [workMode, setWorkMode] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [eligibleOnly, setEligibleOnly] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, total: 1, hasNext: false, hasPrev: false, totalJobs: 0 });
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page, limit: 12, sortBy, sortOrder: 'desc',
        eligibleOnly: eligibleOnly ? 'true' : 'false',
        ...(search && { search }),
        ...(locFilter && { location: locFilter }),
        ...(driveType && { driveType }),
        ...(workMode !== 'All' && { workMode }),
        ...(expFilter !== 'All' && { experience: expFilter }),
      };
      const res = await studentApi.getAvailableJobs(params);
      if (res?.success) {
        const data = res.data || {};
        setJobs(data.jobs || []);
        const p = data.pagination || {};
        setPagination({ current: page, total: p.total || 1, hasNext: !!p.hasNext, hasPrev: !!p.hasPrev, totalJobs: p.total ? (p.total * 12) : (data.jobs?.length || 0) });
      } else {
        setError(res?.message || 'Failed to load jobs');
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'An error occurred');
    }
    setLoading(false);
  }, [search, sortBy, driveType, locFilter, workMode, expFilter, eligibleOnly]);

  useEffect(() => { fetchJobs(1); }, [fetchJobs]);

  const handleApply = async (job) => {
    await studentApi.applyForJob(job.id || job._id, { 
      coverLetter: job.coverLetter || '',
      resume: job.resume 
    });
    // Refresh jobs to show "Applied" status
    fetchJobs(pagination.current);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center shadow-sm">
            <Briefcase size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Browse Jobs</h1>
            <p className="text-xs text-slate-500 font-medium">{loading ? 'Loading...' : `${jobs.length} ${pagination.totalJobs > 12 ? `of ${pagination.totalJobs}` : ''} opportunities`}</p>
          </div>
        </div>

        {/* Eligibility Toggle */}
        <button
          onClick={() => setEligibleOnly(!eligibleOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded border-2 transition-all ${
            eligibleOnly 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
          }`}
        >
          {eligibleOnly ? <CheckCircle2 size={16} /> : <Filter size={16} />}
          <span className="text-xs font-black uppercase tracking-widest">
            {eligibleOnly ? 'Eligible Only' : 'Show All'}
          </span>
        </button>
      </div>

      {/* Search and Filters Array */}
      <div className="bg-white border border-slate-200 rounded p-5 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Term */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs(1)}
              placeholder="Search by role, company or skill..."
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder-slate-400"
            />
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={locFilter}
              onChange={e => setLocFilter(e.target.value)}
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none cursor-pointer font-bold"
            >
              <option value="">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Remote">Remote</option>
            </select>
            
            <select
              value={workMode}
              onChange={e => setWorkMode(e.target.value)}
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none cursor-pointer font-bold"
            >
              <option value="All">All Modes</option>
              <option value="office">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              value={expFilter}
              onChange={e => setExpFilter(e.target.value)}
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none cursor-pointer font-bold"
            >
              <option value="All">Experience</option>
              <option value="0">Freshers</option>
              <option value="1">Entry Level (0-2y)</option>
              <option value="2-3">Mid Level (2-3y)</option>
            </select>

            <select
              value={driveType}
              onChange={e => setDriveType(e.target.value)}
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none cursor-pointer font-bold"
            >
              <option value="">All Drives</option>
              <option value="on_campus">On-Campus</option>
              <option value="off_campus">Off-Campus</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors appearance-none cursor-pointer font-bold"
            >
              <option value="postedAt">Newest</option>
              <option value="ctc">Salary</option>
              <option value="applicationDeadline">Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid / States */}
      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 rounded bg-rose-50 border border-rose-100 flex items-center justify-center mb-5">
            <AlertCircle size={24} className="text-rose-500" />
          </div>
          <p className="font-bold text-slate-900 text-lg mb-1">Couldn't load jobs</p>
          <p className="text-sm text-slate-500 mb-6 font-medium">{error}</p>
          <button onClick={() => fetchJobs(1)} className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-sm">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded border border-slate-200 p-6 animate-pulse">
              <div className="flex gap-4 mb-5"><div className="w-12 h-12 rounded bg-slate-100" /><div className="flex-1 pt-1"><div className="h-4 bg-slate-100 rounded w-3/4 mb-3"/><div className="h-3 bg-slate-100 rounded w-1/2"/></div></div>
              <div className="flex gap-2 mb-4">{[...Array(3)].map((_,j)=><div key={j} className="h-6 bg-slate-100 rounded w-16"/>)}</div>
              <div className="flex gap-4 mb-4">{[...Array(2)].map((_,j)=><div key={j} className="h-5 bg-slate-100 rounded w-20"/>)}</div>
              <div className="flex justify-between mt-auto pt-4 border-t border-slate-100"><div className="h-3 bg-slate-100 rounded w-16"/><div className="h-3 bg-slate-100 rounded w-20"/></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 rounded bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
            <Briefcase size={24} className="text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">No jobs found</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6 font-medium">Try adjusting your search criteria or filters to find more opportunities.</p>
          <button onClick={() => { setSearch(''); setDriveType(''); setLocFilter(''); }}
            className="text-sm font-bold px-6 py-2.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-sm">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map(job => (
              <JobCard
                key={job.id || job._id}
                job={job}
                onView={setSelectedJob}
              />
            ))}
          </div>

          {/* Pagination */}
          {(pagination.hasNext || pagination.hasPrev) && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button disabled={!pagination.hasPrev} onClick={() => fetchJobs(pagination.current - 1)}
                className="w-10 h-10 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded">
                Page {pagination.current} of {pagination.total}
              </span>
              <button disabled={!pagination.hasNext} onClick={() => fetchJobs(pagination.current + 1)}
                className="w-10 h-10 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}
    </div>
  );
};

export default JobBrowse;
