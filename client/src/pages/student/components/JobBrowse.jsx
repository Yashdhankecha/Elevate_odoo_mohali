import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, MapPin, Briefcase, Clock, Building2, Heart,
  X, ChevronRight, ChevronLeft, Send, GraduationCap,
  CheckCircle2, AlertCircle, BookOpen, Code2, Users, Calendar,
  DollarSign, Globe, Wifi, Monitor, Star, TrendingUp, Award,
  ExternalLink, Phone, Mail, RefreshCw, XCircle, Eye, Layers
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';

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
  const sz = size === 'lg' ? 'w-16 h-16 rounded-2xl text-xl' : 'w-11 h-11 rounded-xl text-sm';
  return (
    <div className={`${sz} bg-gradient-to-br ${grad(name)} flex items-center justify-center text-white font-black shadow-lg flex-shrink-0`}>
      {initials(name)}
    </div>
  );
};

// ─── Job Card ────────────────────────────────────────────────────────────────
const JobCard = ({ job, isSaved, onSave, onView }) => {
  const deadline = fmtDeadline(job.deadline);
  const drive    = DRIVE[job.driveType] || DRIVE.off_campus;
  const wm       = (job.isRemote ? 'remote' : '');
  const WorkIcon = WORK_ICON[wm] || null;

  return (
    <div
      onClick={() => onView(job)}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-[0_8px_40px_-12px_rgba(59,130,246,0.18)] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Hover accent */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="p-5 flex flex-col flex-1">
        {/* Row 1 — logo + title */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar name={job.company} logo={job.companyLogo} />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[15px] text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-slate-500 text-sm mt-0.5 line-clamp-1 flex items-center gap-1">
              <Building2 size={11} className="flex-shrink-0" /> {job.company}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${isSaved ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500'}`}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            <Heart size={12} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Row 2 — badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${drive.cls}`}>{drive.label}</span>
          {job.jobType && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 capitalize">{job.jobType}</span>
          )}
          {WorkIcon && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
              <WorkIcon size={9} /> Remote
            </span>
          )}
          {/* Eligibility chip */}
          {job.eligibility && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${
              job.eligibility.eligible
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {job.eligibility.eligible ? <CheckCircle2 size={8} /> : <XCircle size={8} />}
              {job.eligibility.eligible ? 'Eligible' : 'Not eligible'}
            </span>
          )}
        </div>

        {/* Row 3 — key details */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1 text-xs text-green-700 font-semibold">
            <DollarSign size={11} className="text-green-500" /> {job.salary}
          </div>
          {job.location && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={10} /> {job.location}
            </div>
          )}
          {job.totalRounds > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Layers size={10} /> {job.totalRounds} rounds
            </div>
          )}
          {job.eligibilityCriteria?.minCgpaPercentage?.value && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Star size={10} /> CGPA ≥ {job.eligibilityCriteria.minCgpaPercentage.value}
            </div>
          )}
        </div>

        {/* Row 4 — skills */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.skills.slice(0, 4).map(s => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100">{s}</span>
            ))}
            {job.skills.length > 4 && <span className="text-[10px] px-2 py-0.5 rounded-md text-slate-400">+{job.skills.length - 4}</span>}
          </div>
        )}

        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Clock size={10} />{timeAgo(job.postedDate)}
            {deadline && <span className={`${deadline.cls} flex items-center gap-0.5`}><Calendar size={10} /> {deadline.label}</span>}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 group-hover:text-blue-700">
            View details <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Subcomponents for modal ─────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><Icon size={12} className="text-blue-600" /></div>
      <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{title}</h4>
    </div>
    {children}
  </div>
);

const Chip = ({ label, value, highlight }) => (
  <div className={`rounded-xl p-2.5 border ${highlight ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className={`text-[13px] font-bold mt-0.5 ${highlight ? 'text-green-700' : 'text-slate-800'}`}>{value}</p>
  </div>
);

const Tag = ({ label, color = 'slate' }) => {
  const C = { slate: 'bg-slate-100 text-slate-700 border-slate-200', violet: 'bg-violet-50 text-violet-700 border-violet-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', teal: 'bg-teal-50 text-teal-700 border-teal-100', blue: 'bg-blue-50 text-blue-700 border-blue-100' };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${C[color] || C.slate}`}>{label}</span>;
};

// ─── Job Detail Modal ────────────────────────────────────────────────────────
const JobDetailModal = ({ job, onClose, onApply, isSaved, onSave }) => {
  const [tab, setTab] = useState('overview');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  if (!job) return null;

  const deadline = fmtDeadline(job.deadline);
  const drive    = DRIVE[job.driveType] || DRIVE.off_campus;

  const handleApply = async () => {
    setApplying(true);
    try { await onApply({ ...job, coverLetter }); setApplied(true); } catch (_) {}
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl sm:rounded-3xl overflow-hidden rounded-t-3xl">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-5 sm:p-6 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all text-white z-10">
            <X size={15} />
          </button>
          <div className="flex gap-4 items-start pr-10">
            <Avatar name={job.company} logo={job.companyLogo} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${drive.cls}`}>{drive.label}</span>
                {job.jobType && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80">{job.jobType}</span>}
                {job.eligibility && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${job.eligibility.eligible ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-red-500/20 text-red-300 border-red-400/30'}`}>
                    {job.eligibility.eligible ? <CheckCircle2 size={8} /> : <XCircle size={8} />}
                    {job.eligibility.eligible ? 'You\'re eligible' : 'Not eligible'}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">{job.title}</h2>
              <p className="text-blue-200 text-sm mt-1">{job.company}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-green-300 font-bold"><DollarSign size={11} className="text-green-400" />{job.salary}</span>
                {job.location && <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>}
                {deadline && <span className={`flex items-center gap-1 ${deadline.cls}`}><Calendar size={10} />{deadline.label}</span>}
              </div>
            </div>
            <button onClick={() => onSave(job.id)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 self-start ${isSaved ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-rose-500 text-white'}`}>
              <Heart size={14} fill={isSaved ? 'white' : 'none'} />
            </button>
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
                  <p className="mt-3 text-sm text-slate-600 bg-green-50 rounded-xl p-3 border border-green-100">
                    🎁 <span className="font-medium text-green-700">Perks:</span> {job.benefits.join(', ')}
                  </p>
                )}
              </Section>

              <Section title="Important Dates" icon={Calendar}>
                <div className="space-y-1">
                  {job.deadline && (
                    <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                      <span className="text-slate-500">Application Deadline</span>
                      <span className="font-semibold text-slate-800">{new Date(job.deadline).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                  )}
                  {job.tentativeDriveDate && (
                    <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                      <span className="text-slate-500">Drive Date</span>
                      <span className="font-semibold text-slate-800">{new Date(job.tentativeDriveDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
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
                <div className={`rounded-2xl p-4 border ${job.eligibility.eligible ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {job.eligibility.eligible ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-orange-600" />}
                    <span className={`font-bold ${job.eligibility.eligible ? 'text-green-800' : 'text-orange-800'}`}>
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
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 shadow shadow-blue-200">
                          {r.roundNumber || i + 1}
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{r.roundName}</p>
                              <p className="text-xs text-slate-500 capitalize">{(r.roundType || '').replace(/_/g, ' ')}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {r.duration && <span className="text-xs bg-white px-2 py-0.5 rounded-lg border border-slate-100 font-medium text-slate-600">{r.duration}</span>}
                              {r.mode && <p className="text-[10px] text-slate-400 mt-1 capitalize">{r.mode}</p>}
                            </div>
                          </div>
                          {r.platform && <p className="text-xs text-blue-600 font-medium mt-1">📍 {r.platform}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">No process details available yet.</div>
              )}

              {job.pptRequired && job.pptDetails && (
                <Section title="Pre-Placement Talk" icon={Users}>
                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 grid grid-cols-1 gap-2">
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
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-3">
                  <AlertCircle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-orange-800 text-sm">You may not meet all criteria</p>
                    <ul className="text-xs text-orange-700 mt-1 space-y-0.5 list-disc list-inside">
                      {job.eligibility.issues.map((iss, i) => <li key={i}>{iss}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              <Section title="Cover Letter" icon={Send}>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Tell the company why you're a great fit for this role..."
                  rows={5}
                  className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none placeholder-slate-300"
                />
                <p className="text-[11px] text-slate-400 mt-1">{coverLetter.length}/500 characters</p>
              </Section>

              {applied ? (
                <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold py-4 rounded-2xl text-sm">
                  <CheckCircle2 size={16} /> Application submitted successfully!
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl text-sm"
                >
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
  const [saved, setSaved] = useState([]);
  const [sortBy, setSortBy] = useState('postedAt');
  const [showFilters, setShowFilters] = useState(false);
  const [driveType, setDriveType] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const [pagination, setPagination] = useState({ current: 1, total: 1, hasNext: false, hasPrev: false, totalJobs: 0 });
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page, limit: 12, sortBy, sortOrder: 'desc',
        ...(search && { search }),
        ...(locFilter && { location: locFilter }),
        ...(driveType && { driveType }),
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
  }, [search, sortBy, driveType, locFilter]);

  useEffect(() => { fetchJobs(1); }, [fetchJobs]);

  const handleApply = async (job) => {
    await studentApi.applyForJob(job.id || job._id, { coverLetter: job.coverLetter || '' });
  };

  const toggleSave = (id) => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const DRIVE_FILTERS = [
    { value: '', label: 'All' },
    { value: 'off_campus', label: 'Off-Campus' },
    { value: 'on_campus', label: 'On-Campus' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Briefcase size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Browse Jobs</h1>
            <p className="text-xs text-slate-400">{loading ? 'Loading...' : `${jobs.length} ${pagination.totalJobs > 12 ? `of ${pagination.totalJobs}` : ''} opportunities`}</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchJobs(1)}
            placeholder="Search by role, company or skill..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder-slate-300"
          />
        </div>
        <button onClick={() => fetchJobs(1)} className="px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
          <Search size={14} />
        </button>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {/* Drive type filter */}
        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
          {DRIVE_FILTERS.map(df => (
            <button key={df.value} onClick={() => setDriveType(df.value)}
              className={`text-xs font-bold px-3 py-2 transition-all ${driveType === df.value ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {df.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:border-blue-400">
          <option value="postedAt">Newest first</option>
          <option value="ctc">Highest salary</option>
          <option value="applicationDeadline">Earliest deadline</option>
        </select>

        {/* Advanced filter toggle */}
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
          <Filter size={11} /> Filters {showFilters && <X size={10} />}
        </button>

        <div className="flex-1" />
        {/* Results count */}
        <span className="text-xs text-slate-400 font-medium">
          {!loading && `Page ${pagination.current}/${pagination.total}`}
        </span>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</label>
            <input value={locFilter} onChange={e => setLocFilter(e.target.value)}
              placeholder="Any city..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={() => { fetchJobs(1); setShowFilters(false); }}
              className="text-xs font-bold py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">Apply</button>
            <button onClick={() => { setDriveType(''); setLocFilter(''); setSearch(''); }}
              className="text-xs font-bold py-2 px-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">Clear</button>
          </div>
        </div>
      )}

      {/* Grid / States */}
      {error ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="font-bold text-slate-800 mb-1">Couldn't load jobs</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button onClick={() => fetchJobs(1)} className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 text-white rounded-xl">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
              <div className="flex gap-3 mb-4"><div className="w-11 h-11 rounded-xl bg-slate-100" /><div className="flex-1"><div className="h-4 bg-slate-100 rounded w-3/4 mb-2"/><div className="h-3 bg-slate-100 rounded w-1/2"/></div></div>
              <div className="flex gap-1 mb-3">{[...Array(3)].map((_,j)=><div key={j} className="h-5 bg-slate-100 rounded-full w-16"/>)}</div>
              <div className="flex gap-3 mb-3">{[...Array(2)].map((_,j)=><div key={j} className="h-4 bg-slate-100 rounded w-20"/>)}</div>
              <div className="flex gap-1 mb-4">{[...Array(4)].map((_,j)=><div key={j} className="h-5 bg-slate-100 rounded w-12"/>)}</div>
              <div className="pt-3 border-t border-slate-50 flex justify-between"><div className="h-3 bg-slate-100 rounded w-16"/><div className="h-3 bg-slate-100 rounded w-20"/></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
            <Briefcase size={28} className="text-slate-300" />
          </div>
          <h3 className="font-black text-slate-800 text-lg mb-2">No jobs found</h3>
          <p className="text-sm text-slate-500 max-w-xs">Try adjusting your search or filters.</p>
          <button onClick={() => { setSearch(''); setDriveType(''); setLocFilter(''); }}
            className="mt-5 text-sm font-bold px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
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
                isSaved={saved.includes(job.id)}
                onSave={toggleSave}
                onView={setSelectedJob}
              />
            ))}
          </div>

          {/* Pagination */}
          {(pagination.hasNext || pagination.hasPrev) && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button disabled={!pagination.hasPrev} onClick={() => fetchJobs(pagination.current - 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
                <ChevronLeft size={15} />
              </button>
              <span className="text-sm font-bold text-slate-600">Page {pagination.current} of {pagination.total}</span>
              <button disabled={!pagination.hasNext} onClick={() => fetchJobs(pagination.current + 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
                <ChevronRight size={15} />
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
          isSaved={saved.includes(selectedJob.id)}
          onSave={toggleSave}
        />
      )}
    </div>
  );
};

export default JobBrowse;
