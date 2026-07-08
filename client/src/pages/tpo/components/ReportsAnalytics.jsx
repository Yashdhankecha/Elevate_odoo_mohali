import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, Download, Users, Building2, Trophy, Target,
  FileSpreadsheet, Search, Loader2, RefreshCw, AlertCircle,
  ChevronLeft, ChevronRight, GraduationCap, Activity, Filter,
  CheckCircle2, XCircle, ArrowUpRight
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import tpoApi from '../../../services/tpoApi';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPkg = (v) => {
  const n = Number(v);
  return !isNaN(n) && n > 0 ? `₹${(n / 100000).toFixed(1)}L` : '—';
};
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

// ─── Tabs definition ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',   label: 'Overview',          icon: BarChart3 },
  { id: 'records',    label: 'Placement Records',  icon: Trophy },
  { id: 'master',     label: 'Master Data',        icon: Users },
];

const PAGE_SIZE = 15;

// ─── Main Component ───────────────────────────────────────────────────────────
const ReportsAnalytics = () => {
  const [tab, setTab]           = useState('overview');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [analytics, setAnalytics] = useState({ overview: {}, departmentStats: [], companyStats: [], recentPlacements: [] });

  // Master Data state
  const [students, setStudents]   = useState([]);
  const [stuLoading, setStuLoading] = useState(false);
  const [stuSearch, setStuSearch] = useState('');
  const [stuDept, setStuDept]     = useState('');
  const [stuStatus, setStuStatus] = useState('');
  const [stuPage, setStuPage]     = useState(1);
  const [stuTotal, setStuTotal]   = useState(0);
  const [stuPages, setStuPages]   = useState(1);

  // ── Fetch overview analytics ─────────────────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await tpoApi.getReportsAnalytics();
      if (res) setAnalytics(res);
    } catch { setError('Failed to load analytics.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  // ── Fetch master data students ────────────────────────────────────────────
  const fetchStudents = useCallback(async (page = 1) => {
    setStuLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (stuSearch) params.search = stuSearch;
      if (stuDept)   params.department = stuDept;
      if (stuStatus) params.status = stuStatus;
      const res = await tpoApi.getStudents(params);
      setStudents(res?.students || []);
      setStuTotal(res?.pagination?.total || 0);
      setStuPages(res?.pagination?.totalPages || 1);
      setStuPage(page);
    } catch { toast.error('Failed to load students.'); }
    finally { setStuLoading(false); }
  }, [stuSearch, stuDept, stuStatus]);

  useEffect(() => {
    if (tab === 'master') fetchStudents(1);
  }, [tab, stuSearch, stuDept, stuStatus, fetchStudents]);

  // ── Export helpers ────────────────────────────────────────────────────────
  const exportExcel = async () => {
    try {
      toast.loading('Preparing export…', { id: 'exp' });
      // Fetch ALL students for export (no pagination)
      const res = await tpoApi.getStudents({ limit: 9999 });
      const rows = (res?.students || []).map(s => ({
        'Name':           s.name || '',
        'Email':          s.email || '',
        'Roll No':        s.rollNumber || '',
        'Branch':         s.branch || '',
        'CGPA':           s.cgpa ?? '',
        'Graduation Year':s.graduationYear || '',
        'Phone':          s.phoneNumber || '',
        'Status':         s.isPlaced ? 'Placed' : 'Not Placed',
        'Company':        s.placementDetails?.company || '',
        'Package (LPA)':  s.placementDetails?.package?.amount ? (s.placementDetails.package.amount / 100000).toFixed(2) : '',
        'Role':           s.placementDetails?.role || '',
        'Placement Date': fmtDate(s.placementDetails?.placementDate),
        'Verification':   s.verificationStatus || '',
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Master_Data');
      XLSX.writeFile(wb, `TPO_Master_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success('Excel exported!', { id: 'exp' });
    } catch { toast.error('Export failed.', { id: 'exp' }); }
  };

  const exportPlacementExcel = () => {
    const placed = (analytics.recentPlacements || []);
    if (!placed.length) { toast.error('No placement data to export.'); return; }
    const rows = placed.map(p => ({
      'Student':   p.student,
      'Branch':    p.department,
      'Company':   p.company,
      'Package':   fmtPkg(p.package),
      'Date':      fmtDate(p.date),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Placements');
    XLSX.writeFile(wb, `Placement_Records_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success('Placement records exported!');
  };

  const ov = analytics.overview || {};

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <Loader2 className="animate-spin w-10 h-10 text-slate-400 mb-4" />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Analytics…</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-600" /> Reports &amp; Analytics
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Placement performance, department stats, and complete student records.</p>
        </div>
        <button onClick={fetchAnalytics} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded text-sm text-rose-700 font-medium">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t overflow-x-auto">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap
                ${tab === t.id ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB: OVERVIEW
      ═══════════════════════════════════════════════════════════════════════ */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Students',   val: ov.totalStudents ?? 0,       icon: Users,    c: 'text-blue-600',   bg: 'bg-blue-50' },
              { label: 'Placed Students',  val: ov.placedStudents ?? 0,      icon: Trophy,   c: 'text-emerald-600',bg: 'bg-emerald-50' },
              { label: 'Placement Rate',   val: `${ov.placementRate ?? 0}%`, icon: Target,   c: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Total Applications',val:ov.totalApplications ?? 0,   icon: Activity, c: 'text-amber-600',  bg: 'bg-amber-50' },
            ].map((k, i) => {
              const Icon = k.icon;
              return (
                <div key={i} className="bg-white rounded border border-slate-200 shadow-sm p-5 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{k.label}</p>
                    <p className="text-2xl font-black text-slate-900">{k.val}</p>
                  </div>
                  <div className={`p-3 rounded ${k.bg} ${k.c}`}><Icon size={18} /></div>
                </div>
              );
            })}
          </div>

          {/* Dept + Company grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Department Performance */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <BarChart3 size={15} className="text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900">Department Performance</h3>
              </div>
              <div className="p-6 space-y-5">
                {(analytics.departmentStats || []).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">No department data available.</p>
                )}
                {(analytics.departmentStats || []).map((d, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>{d.department}</span>
                      <span className="text-slate-500">{d.placed}/{d.total} · <span className="text-blue-600">{Number(d.rate || 0).toFixed(1)}%</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, d.rate || 0)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Recruiters */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Building2 size={15} className="text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">Top Recruiters</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {(analytics.companyStats || []).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-12">No recruiter data available.</p>
                )}
                {(analytics.companyStats || []).slice(0, 6).map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-900 rounded text-white flex items-center justify-center font-bold text-xs">
                        {(c.company || '?')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-800 truncate max-w-[160px]">{c.company}</span>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Offers</p>
                        <p className="text-sm font-black text-slate-900">{c.offers ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Rate</p>
                        <p className="text-sm font-black text-emerald-600">{c.successRate ?? 0}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB: PLACEMENT RECORDS
      ═══════════════════════════════════════════════════════════════════════ */}
      {tab === 'records' && (
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={15} className="text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Recent Placement Records</h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                {(analytics.recentPlacements || []).length} records
              </span>
            </div>
            <button onClick={exportPlacementExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold hover:bg-emerald-100 transition-colors">
              <FileSpreadsheet size={13} /> Export Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Student', 'Branch', 'Company', 'Package', 'Placement Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(analytics.recentPlacements || []).length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-400">No placement records found.</td></tr>
                ) : (
                  (analytics.recentPlacements || []).map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{p.student}</td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{p.department || '—'}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-semibold">{p.company || '—'}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{fmtPkg(p.package)}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{fmtDate(p.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          TAB: MASTER DATA
      ═══════════════════════════════════════════════════════════════════════ */}
      {tab === 'master' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={stuSearch} onChange={e => { setStuSearch(e.target.value); setStuPage(1); }}
                  placeholder="Search by name, roll no, email…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded focus:outline-none focus:border-slate-400 bg-slate-50 placeholder-slate-400" />
              </div>
              <select value={stuDept} onChange={e => { setStuDept(e.target.value); setStuPage(1); }}
                className="px-4 py-2.5 text-sm border border-slate-200 rounded bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-slate-400 appearance-none cursor-pointer">
                <option value="">All Branches</option>
                {['CSE','IT','ECE','ME','CE','EE','AI&DS','Other'].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select value={stuStatus} onChange={e => { setStuStatus(e.target.value); setStuPage(1); }}
                className="px-4 py-2.5 text-sm border border-slate-200 rounded bg-slate-50 font-bold text-slate-700 focus:outline-none focus:border-slate-400 appearance-none cursor-pointer">
                <option value="">All Students</option>
                <option value="Placed">Placed</option>
                <option value="Not Placed">Not Placed</option>
              </select>
              <button onClick={exportExcel}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors shrink-0">
                <FileSpreadsheet size={13} /> Export Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{stuTotal} students total</span>
              <span className="text-xs text-slate-400">Page {stuPage} of {stuPages}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['#','Name','Roll No','Branch','CGPA','Grad Year','Phone','Status','Company','Package','Verification'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stuLoading ? (
                    <tr><td colSpan={11} className="py-16 text-center">
                      <Loader2 className="animate-spin w-6 h-6 text-slate-400 mx-auto" />
                    </td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan={11} className="py-16 text-center text-sm text-slate-400">No students found.</td></tr>
                  ) : students.map((s, i) => (
                    <tr key={s._id || i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-400 font-bold">{(stuPage - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{s.name}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-xs">{s.rollNumber || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">{s.branch || '—'}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">{s.cgpa ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{s.graduationYear || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{s.phoneNumber || '—'}</td>
                      <td className="px-4 py-3">
                        {s.isPlaced
                          ? <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded"><CheckCircle2 size={10} />Placed</span>
                          : <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded"><XCircle size={10} />Not Placed</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-700 text-xs whitespace-nowrap">{s.placementDetails?.company || '—'}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{fmtPkg(s.placementDetails?.package?.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase
                          ${s.verificationStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : s.verificationStatus === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {s.verificationStatus || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {stuPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Showing {(stuPage - 1) * PAGE_SIZE + 1}–{Math.min(stuPage * PAGE_SIZE, stuTotal)} of {stuTotal}
                </span>
                <div className="flex items-center gap-2">
                  <button disabled={stuPage <= 1} onClick={() => fetchStudents(stuPage - 1)}
                    className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: Math.min(5, stuPages) }, (_, i) => {
                    const p = stuPage <= 3 ? i + 1 : stuPage - 2 + i;
                    if (p < 1 || p > stuPages) return null;
                    return (
                      <button key={p} onClick={() => fetchStudents(p)}
                        className={`w-8 h-8 rounded border text-xs font-bold transition-colors
                          ${p === stuPage ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button disabled={stuPage >= stuPages} onClick={() => fetchStudents(stuPage + 1)}
                    className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
