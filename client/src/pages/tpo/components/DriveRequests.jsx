import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import tpoApi from '../../../services/tpoApi';
import {
    Search, Eye, Building2, Briefcase, Calendar, Banknote,
    Loader2, CheckCircle, XCircle, Clock, AlertCircle, X,
    Globe, Phone, Mail, GraduationCap, Award, Activity,
    Filter, RefreshCw, ChevronDown, Users, MapPin, Hash,
    ArrowRight, FileText, Target, Layers, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────
// Tiny helpers
// ─────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
const fmtTs = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;

const STATUS_CFG = {
    pending_approval: { label: 'Pending Approval', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', Icon: Clock },
    approved: { label: 'Approved', bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7', Icon: CheckCircle },
    active: { label: 'Active', bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7', Icon: CheckCircle },
    rejected: { label: 'Rejected', bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5', Icon: XCircle },
    changes_requested: { label: 'Changes Needed', bg: '#FFEDD5', color: '#9A3412', border: '#FED7AA', Icon: AlertCircle },
    draft: { label: 'Draft', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1', Icon: Clock },
};

const StatusPill = ({ status }) => {
    const cfg = STATUS_CFG[status] || STATUS_CFG.draft;
    const { Icon } = cfg;
    return (
        <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            <Icon size={10} strokeWidth={2.5} />
            {cfg.label}
        </span>
    );
};

// ─────────────────────────────────────────
// Drawer rendered via Portal (avoids stacking-context issues)
// ─────────────────────────────────────────
const Drawer = ({ id, onClose, onStatusChange }) => {
    const [drive, setDrive] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [comment, setComment] = useState('');
    const [actionMode, setActionMode] = useState(null); // 'reject' | 'changes'
    const [visible, setVisible] = useState(false);

    // Tabs state
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'applicants'
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);

    // Animate in
    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => { loadDrive(); }, [id]);

    const loadDrive = async () => {
        setLoading(true);
        try {
            const data = await tpoApi.getDriveRequestDetail(id);
            setDrive(data);
        } catch {
            toast.error('Failed to load drive details');
        } finally {
            setLoading(false);
        }
    };

    const loadApplicants = useCallback(async () => {
        if (loadingApplicants || applicants.length > 0) return; // already loaded
        setLoadingApplicants(true);
        try {
            const data = await tpoApi.getDriveApplicants(id);
            setApplicants(data?.data?.applicants || []);
        } catch {
            toast.error('Failed to load applicants');
        } finally {
            setLoadingApplicants(false);
        }
    }, [id, applicants, loadingApplicants]);

    useEffect(() => {
        if (activeTab === 'applicants') {
            loadApplicants();
        }
    }, [activeTab, loadApplicants]);

    const handleClose = useCallback(() => {
        setVisible(false);
        setTimeout(onClose, 280);
    }, [onClose]);

    const submitAction = async (status) => {
        if ((status === 'rejected' || status === 'changes_requested') && !comment.trim()) {
            toast.error('Please provide a reason / feedback');
            return;
        }
        setUpdating(true);
        try {
            await tpoApi.updateDriveRequestStatus(id, status, comment);
            const label = status === 'approved' ? 'approved ✓' : status === 'rejected' ? 'rejected' : 'returned for changes';
            toast.success(`Drive request ${label}`);
            onStatusChange();
            handleClose();
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const co = drive?.company || {};
    const logoUrl = drive?.companyLogo || co.profilePicture || co.logo;

    // ── Sub-components scoped inside drawer ──
    const SectionTitle = ({ icon: Icon, text }) => (
        <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Icon size={13} className="text-indigo-600" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">{text}</p>
        </div>
    );

    const KV = ({ label, value, wide }) => {
        if (!value && value !== 0) return null;
        return (
            <div className={wide ? 'col-span-2' : ''}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-800 leading-snug">{value}</p>
            </div>
        );
    };

    const Chips = ({ label, items }) => {
        if (!items?.length) return null;
        return (
            <div>
                {label && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>}
                <div className="flex flex-wrap gap-1.5">
                    {items.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">{t}</span>
                    ))}
                </div>
            </div>
        );
    };

    const Card = ({ children, className = '' }) => (
        <div className={`bg-white rounded-2xl border border-slate-100 p-5 ${className}`}>
            {children}
        </div>
    );

    const drawerContent = (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'stretch',
                fontFamily: 'inherit',
            }}
        >
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(15,23,42,0.55)',
                    backdropFilter: 'blur(4px)',
                    transition: 'opacity 0.28s ease',
                    opacity: visible ? 1 : 0,
                }}
            />

            {/* Panel */}
            <div
                style={{
                    position: 'relative',
                    marginLeft: 'auto',
                    width: '100%',
                    maxWidth: 760,
                    height: '100%',
                    background: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '-8px 0 48px rgba(0,0,0,0.18)',
                    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
                    transform: visible ? 'translateX(0)' : 'translateX(100%)',
                    overflowY: 'hidden',
                }}
            >
                {/* ── Panel Header ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    padding: '20px 24px',
                    flexShrink: 0,
                    color: '#fff',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(199,210,254,0.9)', marginBottom: 6 }}>
                                Drive Request Detail
                            </p>
                            {loading ? (
                                <div style={{ height: 24, width: 180, background: 'rgba(255,255,255,0.15)', borderRadius: 8 }} />
                            ) : (
                                <h2 style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.2, margin: 0, letterSpacing: '-0.02em' }}>
                                    {drive?.jobTitle || '—'}
                                </h2>
                            )}
                            {!loading && drive && (
                                <p style={{ fontSize: 12, color: 'rgba(199,210,254,0.85)', marginTop: 4, fontWeight: 600 }}>
                                    {drive.companyName || co.companyName} · {drive.driveType === 'on_campus' ? 'On Campus' : 'Off Campus'}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            style={{
                                width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}
                        >
                            <X size={17} />
                        </button>
                    </div>
                </div>

                {/* ── Tabs ── */}
                {!loading && drive && (drive.status === 'active' || drive.status === 'approved') && (
                    <div style={{ padding: '0 24px', background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: 24 }}>
                        <button
                            onClick={() => setActiveTab('details')}
                            style={{
                                padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: 13, fontWeight: 700, color: activeTab === 'details' ? '#4F46E5' : '#64748B',
                                borderBottom: activeTab === 'details' ? '2px solid #4F46E5' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Drive Details
                        </button>
                        <button
                            onClick={() => setActiveTab('applicants')}
                            style={{
                                padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: 13, fontWeight: 700, color: activeTab === 'applicants' ? '#4F46E5' : '#64748B',
                                borderBottom: activeTab === 'applicants' ? '2px solid #4F46E5' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Applicants ({drive.applicationCount || 0})
                        </button>
                    </div>
                )}

                {/* ── Scrollable Body ── */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', flex: 1 }}>
                            <Loader2 size={40} className="animate-spin" style={{ color: '#6366F1', margin: 'auto' }} />
                        </div>
                    ) : !drive ? (
                        <div style={{ textAlign: 'center', color: '#94A3B8', padding: '80px 0' }}>
                            <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                            <p style={{ fontWeight: 700 }}>Failed to load details</p>
                        </div>
                    ) : activeTab === 'applicants' ? (
                        // ── APPLICANTS TAB ──
                        <div className="flex flex-col gap-4">
                            {loadingApplicants ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                                    <Loader2 size={30} className="animate-spin text-indigo-500" />
                                </div>
                            ) : applicants.length === 0 ? (
                                <Card className="text-center py-12">
                                    <Users size={32} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-sm font-bold text-slate-500">No students from your institute have applied yet.</p>
                                </Card>
                            ) : (
                                applicants.map(app => (
                                    <div key={app.applicationId} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    {app.student?.profilePicture ? (
                                                        <img src={app.student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg font-bold text-indigo-700">{app.student?.name?.[0]?.toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-bold text-slate-900 leading-tight">{app.student?.name || 'Unknown Student'}</h4>
                                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{app.student?.rollNumber || 'No Roll #'} • {app.student?.branch || 'Unspecified Branch'}</p>
                                                    <div className="flex gap-4 mt-2">
                                                        <div className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                            CGPA: <span className="text-slate-900">{app.student?.cgpa || 'N/A'}</span>
                                                        </div>
                                                        {(app.student?.currentBacklogs || 0) > 0 && (
                                                            <div className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                                Backlogs: <span className="text-red-900">{app.student.currentBacklogs}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <StatusPill status={app.applicationStatus} />
                                                <p className="text-[10px] text-slate-400 font-semibold mt-2 text-right">Applied <br /> {fmt(app.appliedDate)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <>
                            {/* ── Company Banner ── */}
                            <Card>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                    {/* Logo */}
                                    <div style={{
                                        width: 72, height: 72, borderRadius: 16, background: '#F1F5F9',
                                        border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
                                    }}>
                                        {logoUrl
                                            ? <img src={logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                                            : <Building2 size={32} color="#CBD5E1" />}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                                            <div style={{ minWidth: 0 }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '0 0 2px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                                    {drive.companyName || co.companyName || '—'}
                                                </h3>
                                                <p style={{ fontSize: 12, color: '#6366F1', fontWeight: 700, margin: 0 }}>{drive.jobTitle}</p>
                                            </div>
                                            <StatusPill status={drive.status} />
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 10 }}>
                                            {(drive.industry || co.industry) && (
                                                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Briefcase size={11} /> {drive.industry || co.industry}
                                                </span>
                                            )}
                                            {(drive.companyLocation || co.headquartersLocation) && (
                                                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <MapPin size={11} /> {drive.companyLocation || co.headquartersLocation}
                                                </span>
                                            )}
                                            {(drive.companySize || co.companySize) && (
                                                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Users size={11} /> {drive.companySize || co.companySize}
                                                </span>
                                            )}
                                            {co.website && (
                                                <a href={co.website} target="_blank" rel="noreferrer"
                                                    style={{ fontSize: 11, color: '#6366F1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                                                    <Globe size={11} /> {co.website}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Company description */}
                                {(drive.companyDescription || co.description) && (
                                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                                        <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', marginBottom: 6 }}>About Company</p>
                                        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 }}>{drive.companyDescription || co.description}</p>
                                    </div>
                                )}
                            </Card>

                            {/* ── Two-column grid: Job Info + Compensation ── */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {/* Job Info */}
                                <Card>
                                    <SectionTitle icon={Briefcase} text="Job Information" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                                        <KV label="Job Role" value={drive.jobTitle} />
                                        <KV label="Employment Type" value={drive.employmentType} />
                                        <KV label="Department" value={drive.department} />
                                        <KV label="Category" value={drive.jobCategory} />
                                        <KV label="Work Mode" value={drive.workMode} />
                                        <KV label="Openings" value={drive.numberOfOpenings} />
                                    </div>
                                    {drive.workLocations?.filter(Boolean).length > 0 && (
                                        <div style={{ marginTop: 12 }}>
                                            <Chips label="Work Locations" items={drive.workLocations.filter(Boolean)} />
                                        </div>
                                    )}
                                </Card>

                                {/* Compensation */}
                                <Card>
                                    <SectionTitle icon={Banknote} text="Compensation" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                                        {drive.ctc && <KV label="CTC / Year" value={`₹${Number(drive.ctc).toLocaleString()}`} />}
                                        {drive.stipend && <KV label="Stipend / Month" value={`₹${Number(drive.stipend).toLocaleString()}`} />}
                                        {drive.baseSalary && <KV label="Base Salary" value={`₹${Number(drive.baseSalary).toLocaleString()}`} />}
                                        {drive.joiningBonus && <KV label="Joining Bonus" value={`₹${Number(drive.joiningBonus).toLocaleString()}`} />}
                                        {drive.performanceBonus && <KV label="Perf. Bonus" value={drive.performanceBonus} />}
                                    </div>
                                    {drive.otherBenefits && (
                                        <div style={{ marginTop: 12 }}>
                                            <KV label="Other Benefits" value={drive.otherBenefits} wide />
                                        </div>
                                    )}
                                </Card>
                            </div>

                            {/* ── Eligibility ── */}
                            <Card>
                                <SectionTitle icon={GraduationCap} text="Eligibility Criteria" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                        <Chips label="Target Batches" items={drive.targetBatches} />
                                        <Chips label="Eligible Degrees" items={drive.eligibleDegrees} />
                                        <Chips label="Eligible Branches" items={drive.eligibleBranches} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px 16px', paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                                        {drive.eligibilityCriteria?.minCgpaPercentage?.value > 0 && (
                                            <KV label={`Min ${drive.eligibilityCriteria.minCgpaPercentage.type?.toUpperCase()}`} value={drive.eligibilityCriteria.minCgpaPercentage.value} />
                                        )}
                                        {drive.eligibilityCriteria?.min10thPercentage > 0 && <KV label="Min 10th %" value={`${drive.eligibilityCriteria.min10thPercentage}%`} />}
                                        {drive.eligibilityCriteria?.min12thPercentage > 0 && <KV label="Min 12th %" value={`${drive.eligibilityCriteria.min12thPercentage}%`} />}
                                        <KV label="Active Backlogs" value={drive.eligibilityCriteria?.backlogsAllowed ? `Allowed (max ${drive.eligibilityCriteria.maxActiveBacklogs || 0})` : 'Not Allowed'} />
                                    </div>
                                    {drive.eligibilityCriteria?.otherCriteria && (
                                        <KV label="Other Criteria" value={drive.eligibilityCriteria.otherCriteria} />
                                    )}
                                </div>
                            </Card>

                            {/* ── Dates ── */}
                            <Card>
                                <SectionTitle icon={Calendar} text="Important Dates" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 24px' }}>
                                    <KV label="Application Deadline" value={fmtTs(drive.applicationDeadline)} />
                                    <KV label="Tentative Drive Date" value={fmt(drive.tentativeDriveDate)} />
                                    {drive.preferredDriveDateRange?.start && (
                                        <KV label="Preferred Range" value={`${fmt(drive.preferredDriveDateRange.start)} → ${fmt(drive.preferredDriveDateRange.end)}`} />
                                    )}
                                    <KV label="Expected Joining" value={fmt(drive.expectedJoiningDate)} />
                                    <KV label="Result Declaration" value={fmt(drive.resultDeclarationDate)} />
                                    <KV label="Submitted On" value={fmt(drive.createdAt)} />
                                </div>
                            </Card>

                            {/* ── Selection Rounds ── */}
                            {drive.selectionRounds?.length > 0 && (
                                <Card>
                                    <SectionTitle icon={Layers} text={`Selection Process · ${drive.selectionRounds.length} Round${drive.selectionRounds.length !== 1 ? 's' : ''}`} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {drive.selectionRounds.map((round, i) => (
                                            <div key={i} style={{
                                                display: 'flex', gap: 14, padding: '14px 16px',
                                                background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0',
                                            }}>
                                                <div style={{
                                                    width: 34, height: 34, borderRadius: '50%', background: '#4F46E5',
                                                    color: '#fff', fontWeight: 900, fontSize: 14, flexShrink: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    {i + 1}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                                                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>{round.roundName || `Round ${i + 1}`}</span>
                                                        {round.roundType && (
                                                            <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 8px', background: '#EEF2FF', color: '#4F46E5', borderRadius: 6 }}>
                                                                {round.roundType.replace(/_/g, ' ')}
                                                            </span>
                                                        )}
                                                        {round.mode && (
                                                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', background: '#F1F5F9', color: '#64748B', borderRadius: 6 }}>
                                                                {round.mode}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                                        {round.duration && <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>⏱ {round.duration}</span>}
                                                        {round.platform && <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>🖥 {round.platform}</span>}
                                                    </div>
                                                    {round.topics && <p style={{ fontSize: 12, color: '#475569', marginTop: 4, fontStyle: 'italic', margin: '4px 0 0' }}>"{round.topics}"</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* ── Job Description ── */}
                            {drive.jobDescription && (
                                <Card>
                                    <SectionTitle icon={FileText} text="Job Description" />
                                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>{drive.jobDescription}</p>
                                </Card>
                            )}

                            {/* ── Skills ── */}
                            {(drive.requiredSkills?.length > 0 || drive.preferredSkills?.length > 0) && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    {drive.requiredSkills?.length > 0 && (
                                        <Card>
                                            <SectionTitle icon={Target} text="Required Skills" />
                                            <Chips label="" items={drive.requiredSkills} />
                                        </Card>
                                    )}
                                    {drive.preferredSkills?.length > 0 && (
                                        <Card>
                                            <SectionTitle icon={Award} text="Preferred Skills" />
                                            <Chips label="" items={drive.preferredSkills} />
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* ── On-Campus Specific ── */}
                            {drive.driveType === 'on_campus' && (
                                <Card>
                                    <SectionTitle icon={Building2} text="On-Campus Details" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 16px' }}>
                                        <KV label="Expected Students" value={drive.expectedStudents} />
                                        <KV label="PPT Required" value={drive.pptRequired ? 'Yes' : 'No'} />
                                        {drive.venueRequirements && <KV label="Venue Requirements" value={drive.venueRequirements} wide />}
                                    </div>
                                    {drive.pptRequired && drive.pptDetails?.dateTime && (
                                        <div style={{ marginTop: 14, padding: '12px 14px', background: '#EFF6FF', borderRadius: 12, border: '1px solid #BFDBFE' }}>
                                            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3B82F6', marginBottom: 6 }}>Pre-Placement Talk</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 16px' }}>
                                                <KV label="Date & Time" value={fmtTs(drive.pptDetails.dateTime)} />
                                                {drive.pptDetails.duration && <KV label="Duration" value={drive.pptDetails.duration} />}
                                                {drive.pptDetails.venue && <KV label="Venue" value={drive.pptDetails.venue} />}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* ── Contact ── */}
                            <Card>
                                <SectionTitle icon={Mail} text="Contact Information" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                    {(drive.hrName || co.receptionistName) && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Users size={14} color="#6366F1" />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '0 0 2px' }}>Contact</p>
                                                <p style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {drive.hrName || co.receptionistName}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {(drive.contactEmail || co.receptionistEmail || co.email) && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Mail size={14} color="#059669" />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '0 0 2px' }}>Email</p>
                                                <p style={{ fontSize: 11, fontWeight: 700, color: '#1E293B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {drive.contactEmail || co.receptionistEmail || co.email}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {(drive.contactPhone || co.receptionistPhone) && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Phone size={14} color="#7C3AED" />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '0 0 2px' }}>Phone</p>
                                                <p style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {drive.contactPhone || co.receptionistPhone}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* ── Feedback / Comment box (pending action) ── */}
                            {actionMode && (
                                <div style={{ padding: '18px 20px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16 }}>
                                    <p style={{ fontSize: 13, fontWeight: 800, color: '#92400E', marginBottom: 10 }}>
                                        {actionMode === 'rejected' ? '⚠️  Rejection Reason' : '📝  Changes Required — Specify Below'}
                                    </p>
                                    <textarea
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="Provide clear feedback for the company..."
                                        rows={3}
                                        style={{
                                            width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 10,
                                            border: '1.5px solid #FDE68A', background: '#fff', resize: 'vertical',
                                            outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                                            color: '#1E293B',
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                                        <button
                                            onClick={() => { setActionMode(null); setComment(''); }}
                                            style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => submitAction(actionMode === 'rejected' ? 'rejected' : 'changes_requested')}
                                            disabled={updating || !comment.trim()}
                                            style={{
                                                padding: '8px 20px', borderRadius: 10, border: 0,
                                                background: updating || !comment.trim() ? '#FCD34D' : '#D97706',
                                                color: '#fff', fontSize: 13, fontWeight: 800, cursor: updating || !comment.trim() ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 8,
                                            }}>
                                            {updating && <Loader2 size={13} className="animate-spin" />}
                                            Confirm & Send
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ── Sticky Action Footer ── */}
                {!loading && drive && drive.status === 'pending_approval' && !actionMode && (
                    <div style={{
                        flexShrink: 0, padding: '16px 24px', borderTop: '1px solid #E2E8F0',
                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
                    }}>
                        <button
                            onClick={() => setActionMode('changes')}
                            disabled={updating}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 12, border: '1.5px solid #FED7AA', background: '#FFF7ED', color: '#C2410C', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                            <AlertCircle size={15} /> Request Changes
                        </button>
                        <button
                            onClick={() => setActionMode('rejected')}
                            disabled={updating}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 12, border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                            <XCircle size={15} /> Reject
                        </button>
                        <button
                            onClick={() => submitAction('approved')}
                            disabled={updating}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px',
                                borderRadius: 12, border: 0, background: 'linear-gradient(135deg, #059669, #047857)',
                                color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                            }}>
                            {updating ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                            Approve Drive
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(drawerContent, document.body);
};

// ─────────────────────────────────────────
// Status Filters
// ─────────────────────────────────────────
const STATUS_FILTERS = [
    { value: 'pending_approval', label: 'Pending Approval' },
    { value: 'active', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'changes_requested', label: 'Changes Requested' },
    { value: 'all', label: 'All Requests' },
];

// ─────────────────────────────────────────
// Main DriveRequests page
// ─────────────────────────────────────────
const DriveRequests = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending_approval');
    const [selectedId, setSelectedId] = useState(null);

    const fetchDrives = useCallback(async () => {
        setLoading(true);
        try {
            const data = await tpoApi.getDriveRequests({ status: statusFilter, search });
            setDrives(data?.drives || []);
        } catch {
            toast.error('Failed to load drive requests');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search]);

    useEffect(() => { fetchDrives(); }, [fetchDrives]);

    const counts = drives.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
    }, {});

    const STAT_CARDS = [
        { label: 'Pending', val: counts['pending_approval'] || 0, color: '#B45309', bg: '#FEF3C7', ring: '#FDE68A' },
        { label: 'Approved', val: (counts['active'] || 0) + (counts['approved'] || 0), color: '#047857', bg: '#D1FAE5', ring: '#6EE7B7' },
        { label: 'Rejected', val: counts['rejected'] || 0, color: '#DC2626', bg: '#FEE2E2', ring: '#FCA5A5' },
        { label: 'Changes Req.', val: counts['changes_requested'] || 0, color: '#C2410C', bg: '#FFEDD5', ring: '#FED7AA' },
    ];

    return (
        <div className="space-y-6 pb-16">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Briefcase size={24} className="text-indigo-600" />
                        Drive Requests
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                        On-campus placement drives submitted by companies for your institute
                    </p>
                </div>
                <button
                    onClick={fetchDrives}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                    <RefreshCw size={13} /> Refresh
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                            <p className="text-3xl font-black" style={{ color: s.color }}>{s.val}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                            <Activity size={16} style={{ color: s.color }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none appearance-none cursor-pointer"
                        >
                            {STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Drive Cards ── */}
            {loading ? (
                <div className="flex items-center justify-center py-28">
                    <Loader2 className="animate-spin text-indigo-600" size={36} />
                </div>
            ) : drives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 text-slate-400">
                    <Briefcase size={44} className="mb-3 opacity-20" />
                    <p className="font-bold text-base">No drive requests found</p>
                    <p className="text-sm mt-1">Try changing the status filter or refresh</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {drives.map(drive => (
                        <div
                            key={drive._id}
                            className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4"
                        >
                            {/* Top */}
                            <div className="flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {drive.companyLogo
                                        ? <img src={drive.companyLogo} alt="logo" className="w-full h-full object-contain p-1" />
                                        : <Building2 size={24} className="text-slate-300" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="min-w-0">
                                            <h3 className="text-base font-black text-slate-900 leading-tight truncate">{drive.jobTitle}</h3>
                                            <p className="text-xs font-bold text-indigo-600 truncate mt-0.5">{drive.companyName}</p>
                                        </div>
                                        <StatusPill status={drive.status} />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {drive.employmentType && (
                                            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-md text-[10px] font-bold uppercase">{drive.employmentType}</span>
                                        )}
                                        {drive.industry && (
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[10px] font-bold">{drive.industry}</span>
                                        )}
                                        {(drive.ctc || drive.stipend) && (
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[10px] font-bold">
                                                {(!isNaN(Number(drive.ctc)) && Number(drive.ctc) > 0) ? `₹${(Number(drive.ctc) / 100000).toFixed(1)} LPA` : (drive.ctc || (drive.stipend ? `₹${Number(drive.stipend).toLocaleString()}/mo` : 'Not Specified'))}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Meta strip */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Deadline', value: fmt(drive.applicationDeadline) || '—' },
                                    { label: 'Drive Date', value: fmt(drive.tentativeDriveDate) || '—' },
                                    { label: 'Rounds', value: drive.totalRounds || drive.selectionRounds?.length || '—' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                                        <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Submitted {fmt(drive.createdAt)}
                                </p>
                                <button
                                    onClick={() => setSelectedId(drive._id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-indigo-200 active:scale-95"
                                >
                                    <Eye size={13} /> View Details
                                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Drawer */}
            {selectedId && (
                <Drawer
                    id={selectedId}
                    onClose={() => setSelectedId(null)}
                    onStatusChange={fetchDrives}
                />
            )}
        </div>
    );
};

export default DriveRequests;
