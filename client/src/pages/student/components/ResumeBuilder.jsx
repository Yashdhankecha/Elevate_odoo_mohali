import React, { useState, useCallback, useEffect } from 'react';
import {
  FileText, Download, User, Mail, Phone, MapPin, GraduationCap,
  Briefcase, Star, Plus, ChevronLeft, ChevronRight, Check,
  Linkedin, Trash2, Save, Rocket, ArrowRight, Award, Layers,
  Palette, Github, Globe, Eye, X
} from 'lucide-react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { SidebarTemplate } from './templates/SidebarTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { BoldTemplate }    from './templates/BoldTemplate';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

// ─── Template Catalog ────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Traditional single-column. Timeless and ATS-friendly.',
    accent: 'bg-slate-800',
    previewLines: ['━━━━━━━━━━━━━━━', '▋▋▋▋▋▋▋▋▋', '▋▋▋▋▋▋', '━━━━━━━━━━━━━━━', '▋▋▋▋▋▋▋▋▋▋▋▋', '▋▋▋▋▋▋▋▋'],
    component: ClassicTemplate,
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    desc: 'Two-column with coloured sidebar. Modern & eye-catching.',
    accent: 'bg-blue-600',
    previewLines: null,
    sidebar: true,
    component: SidebarTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Ultra-clean typography. Designed for creatives & writers.',
    accent: 'bg-zinc-200',
    previewLines: ['EXPERIENCE ──────────────', '  Lead Developer  2023', '  Google', '', 'EDUCATION ────────────────', '  MIT  2019'],
    component: MinimalTemplate,
  },
  {
    id: 'bold',
    name: 'Bold',
    desc: 'Creative header + photo. Stand out in competitive fields.',
    accent: 'bg-indigo-600',
    previewLines: null,
    bold: true,
    component: BoldTemplate,
  },
];

const ACCENT_PRESETS = [
  '#2563eb','#16a34a','#dc2626','#9333ea','#ea580c','#0891b2','#111827',
];

// ─── Mini Input ───────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, value, onChange, type = 'text', placeholder, rows }) => {
  const base = 'w-full bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-colors text-slate-700 placeholder:text-slate-400 shadow-sm';
  return (
    <div className="space-y-1.5">
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>}
      <div className="relative">
        {Icon && <div className="absolute left-3 top-3 text-slate-400"><Icon size={13} /></div>}
        {type === 'textarea'
          ? <textarea rows={rows || 3} value={value} onChange={onChange} placeholder={placeholder} className={`${base} p-3 ${Icon ? 'pl-9' : 'pl-4'}`} />
          : <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`${base} py-3 ${Icon ? 'pl-9' : 'pl-4'} pr-4`} />
        }
      </div>
    </div>
  );
};

// ─── Template Preview Card (Premium) ────────────────────────────────────────
const TemplateCard = ({ tpl, selected, onSelect, accent }) => {
  const ring = selected ? `ring-2 ring-offset-2` : 'ring-0';
  const shadow = selected ? 'shadow-2xl shadow-blue-200/60' : 'shadow-md hover:shadow-xl';

  return (
    <button
      onClick={() => onSelect(tpl.id)}
      className={`relative text-left rounded-2xl overflow-hidden transition-all duration-300 group border-2 ${
        selected ? 'border-blue-500' : 'border-transparent hover:border-slate-200'
      } ${shadow} bg-white`}
    >
      {/* ── Large Visual Preview ── */}
      <div className="h-52 relative overflow-hidden bg-slate-50">

        {/* Classic */}
        {tpl.id === 'classic' && (
          <div className="absolute inset-0 bg-white p-5 flex flex-col">
            <div className="w-36 h-4 rounded bg-slate-800 mb-1" />
            <div className="w-24 h-2.5 rounded bg-slate-400 mb-3" />
            <div className="w-full h-px bg-slate-200 mb-3" />
            <div className="w-20 h-2 rounded mb-2" style={{ backgroundColor: accent + '90' }} />
            {['w-full','w-4/5','w-full','w-3/5'].map((w,i)=>(
              <div key={i} className={`${w} h-1.5 rounded bg-slate-200 mb-1.5`} />
            ))}
            <div className="w-full h-px bg-slate-200 mt-2 mb-3" />
            <div className="w-20 h-2 rounded mb-2" style={{ backgroundColor: accent + '90' }} />
            {['w-full','w-4/5','w-3/4'].map((w,i)=>(
              <div key={i} className={`${w} h-1.5 rounded bg-slate-200 mb-1.5`} />
            ))}
          </div>
        )}

        {/* Sidebar */}
        {tpl.id === 'sidebar' && (
          <div className="absolute inset-0 flex">
            <div className="w-2/5 h-full flex flex-col items-center pt-5 gap-2 px-2" style={{ backgroundColor: accent }}>
              <div className="w-14 h-14 rounded-full bg-white/30 border-2 border-white/60 mb-1" />
              <div className="w-20 h-2.5 rounded bg-white/70" />
              <div className="w-14 h-1.5 rounded bg-white/50" />
              <div className="w-full h-px bg-white/20 my-2" />
              {['w-16','w-20','w-14','w-18'].map((w,i)=>(
                <div key={i} className={`${w} h-1.5 rounded bg-white/40 mb-1`} />
              ))}
            </div>
            <div className="flex-1 bg-white p-4 flex flex-col gap-2">
              <div className="w-3/4 h-2.5 rounded bg-slate-800 mb-1" />
              <div className="w-1/2 h-2 rounded bg-slate-400 mb-2" />
              {['w-full','w-4/5','w-full','w-3/5','w-full'].map((w,i)=>(
                <div key={i} className={`${w} h-1.5 rounded bg-slate-200`} />
              ))}
            </div>
          </div>
        )}

        {/* Minimal */}
        {tpl.id === 'minimal' && (
          <div className="absolute inset-0 bg-white p-5">
            <div className="flex items-baseline gap-1 mb-1">
              <div className="w-20 h-5 rounded bg-slate-200" />
              <div className="w-28 h-5 rounded bg-slate-800" />
            </div>
            <div className="w-28 h-2 rounded bg-slate-300 mb-1" />
            <div className="w-40 h-1.5 rounded bg-slate-200 mb-4" />
            {[['EXPERIENCE','w-full','w-4/5'],['EDUCATION','w-4/5','w-3/5'],['SKILLS','w-full','']].map(([label,l1,l2],i)=>(
              <div key={i} className="flex gap-3 mb-3">
                <div className="w-16 flex flex-col items-end gap-1 pt-0.5">
                  <div className="w-full h-1.5 rounded bg-slate-300" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className={`${l1} h-1.5 rounded bg-slate-700`} />
                  {l2 && <div className={`${l2} h-1.5 rounded bg-slate-300`} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bold */}
        {tpl.id === 'bold' && (
          <div className="absolute inset-0">
            <div className="h-[42%] flex items-center px-4 gap-3" style={{ backgroundColor: accent }}>
              <div className="flex-1">
                <div className="w-32 h-4 rounded bg-white/85 mb-1.5" />
                <div className="w-24 h-2.5 rounded bg-white/50" />
              </div>
              <div className="w-16 h-16 rounded-full bg-white/30 border-2 border-white/70 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/40" />
              </div>
            </div>
            <div className="h-[58%] flex">
              <div className="w-[38%] bg-slate-100 p-3 space-y-1.5">
                <div className="w-full h-1.5 rounded bg-slate-400" />
                <div className="w-3/4 h-1 rounded bg-slate-300" />
                <div className="w-full h-1 rounded bg-slate-300" />
                <div className="flex gap-1 flex-wrap mt-1">
                  {[1,2,3].map(i=>(
                    <div key={i} className="h-4 px-1.5 rounded text-[0px]" style={{ backgroundColor: accent + '30', width:'30%' }} />
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-white p-3 space-y-1.5">
                <div className="w-3/4 h-1.5 rounded bg-slate-700" />
                <div className="w-full h-1 rounded bg-slate-200" />
                <div className="w-4/5 h-1 rounded bg-slate-200" />
                <div className="w-full h-1 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        )}

        {/* Selection overlay glow */}
        {selected && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}25 0%, transparent 70%)` }} />
        )}

        {/* Selected tick */}
        {selected
          ? <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-300/50 transition-all">
              <Check size={13} className="text-white" strokeWidth={3} />
            </div>
          : null
        }
      </div>

      {/* ── Card Footer ── */}
      <div className="px-4 py-3 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <p className={`font-black text-sm transition-colors ${selected ? 'text-blue-600' : 'text-slate-900'}`}>{tpl.name}</p>
          <div className="flex gap-1">
            {tpl.sidebar || tpl.bold ? <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200 uppercase tracking-wider">Photo</span> : null}
            {tpl.id === 'sidebar' || tpl.id === 'bold' ? <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider" style={{ backgroundColor: accent + '20', color: accent }}>Colour</span> : null}
          </div>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">{tpl.desc}</p>
      </div>
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
// Templates that support a circular photo
const PHOTO_TEMPLATES = ['sidebar', 'bold'];

// Convert an image URL to base64 (needed for @react-pdf/renderer)
const urlToBase64 = async (url) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
};

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [photo, setPhoto] = useState(null); // base64 string or null
  const [step, setStep] = useState(0);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supportsPhoto = PHOTO_TEMPLATES.includes(selectedTemplate);

  // Handle photo file upload → convert to base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const [formData, setFormData] = useState({
    personalInfo: { fullName:'', jobTitle:'', email:'', phone:'', location:'', linkedin:'', github:'', summary:'' },
    education:    [{ degree:'', institution:'', startDate:'', endDate:'', gpa:'' }],
    experience:   [{ jobTitle:'', company:'', startDate:'', endDate:'', description:'' }],
    skills:       '',
    languages:    '',
    projects:     [{ name:'', description:'', technologies:'', link:'' }],
    certifications:[{ name:'', issuer:'', year:'' }],
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getProfile();
      if (res.success && res.data) {
        const p = res.data;
        const addr = typeof p.address === 'string' ? p.address
          : [p.address?.city, p.address?.state, p.address?.country].filter(Boolean).join(', ');

        setFormData(prev => ({
          ...prev,
          personalInfo: {
            fullName:  p.name || '',
            jobTitle:  prev.personalInfo.jobTitle || '',
            email:     p.email || '',
            phone:     p.phone || p.phoneNumber || '',
            location:  addr || '',
            linkedin:  p.linkedin || p.links?.linkedin || '',
            github:    p.github || p.links?.github || '',
            summary:   p.summary || '',
          },
          education: p.education?.length
            ? p.education.map(e => ({ degree: e.degree||'', institution: e.institution||'', startDate: e.startDate||'', endDate: e.endDate||e.year||'', gpa: e.gpa||'' }))
            : prev.education,
          experience: p.experience?.length
            ? p.experience.map(e => ({ jobTitle: e.title||e.jobTitle||'', company: e.company||'', startDate: e.startDate||'', endDate: e.endDate||e.duration||'', description: e.description||'' }))
            : prev.experience,
          skills: (() => {
            if (!p.skills) return prev.skills;
            if (p.skills.technicalSkills) return [...(p.skills.technicalSkills||[]),...(p.skills.softSkills||[])].join(', ');
            return Array.isArray(p.skills) ? p.skills.join(', ') : p.skills;
          })(),
          certifications: p.certifications?.length ? p.certifications.map(c => ({ name: c.name||c, issuer: c.issuer||'', year: c.year||'' })) : prev.certifications,
        }));

        // Auto-load profile picture as base64 (default photo for templates)
        const picUrl = p.profilePicture || p.picture || p.avatar;
        if (picUrl && !picUrl.startsWith('data:')) {
          urlToBase64(picUrl).then(b64 => { if (b64) setPhoto(b64); });
        } else if (picUrl) {
          setPhoto(picUrl); // already base64
        }
      }
    } catch { toast.error('Could not load profile data'); }
    finally { setLoading(false); }
  };

  // ── Build the `data` prop that templates expect ──────────────────────────
  const templateData = {
    name:           formData.personalInfo.fullName,
    jobTitle:       formData.personalInfo.jobTitle,
    email:          formData.personalInfo.email,
    phone:          formData.personalInfo.phone,
    location:       formData.personalInfo.location,
    linkedin:       formData.personalInfo.linkedin,
    github:         formData.personalInfo.github,
    summary:        formData.personalInfo.summary,
    photo:          supportsPhoto ? photo : null,
    accentColor,
    experience:     formData.experience,
    education:      formData.education,
    skills:         formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    languages:      formData.languages.split(',').map(s => s.trim()).filter(Boolean),
    certifications: formData.certifications.filter(c => c.name).map(c => c.name + (c.issuer ? ` — ${c.issuer}` : '') + (c.year ? ` (${c.year})` : '')),
  };

  const ActiveTemplate = TEMPLATES.find(t => t.id === selectedTemplate)?.component || ClassicTemplate;

  // ── Mutations ─────────────────────────────────────────────────────────────
  const setPI = (field, val) => setFormData(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: val } }));
  const setListItem = (section, idx, field, val) => setFormData(p => {
    const arr = [...p[section]];
    arr[idx] = { ...arr[idx], [field]: val };
    return { ...p, [section]: arr };
  });
  const addItem = (section, empty) => setFormData(p => ({ ...p, [section]: [...p[section], empty] }));
  const removeItem = (section, idx) => setFormData(p => ({ ...p, [section]: p[section].filter((_, i) => i !== idx) }));

  const handleSaveToProfile = async () => {
    try {
      setSaving(true);
      const loadingToast = toast.loading('Saving to profile...');
      await studentApi.updateProfile({
        name: formData.personalInfo.fullName, email: formData.personalInfo.email,
        phone: formData.personalInfo.phone, phoneNumber: formData.personalInfo.phone,
        summary: formData.personalInfo.summary,
        links: { linkedin: formData.personalInfo.linkedin, github: formData.personalInfo.github },
        education: formData.education, experience: formData.experience,
        skills: { technicalSkills: formData.skills.split(',').map(s => s.trim()).filter(Boolean) },
        certifications: formData.certifications,
      });
      toast.success('Profile synced!', { id: loadingToast });
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-t-4 border-blue-600 rounded-full animate-spin" />
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Profile...</p>
    </div>
  );

  const FORM_STEPS = [
    { title: 'Choose Template', icon: Palette },
    { title: 'Personal Info',   icon: User },
    { title: 'Education',       icon: GraduationCap },
    { title: 'Experience',      icon: Briefcase },
    { title: 'Skills & Languages', icon: Star },
    { title: 'Certifications',  icon: Award },
    { title: 'Preview & Export',icon: Download },
  ];

  const totalSteps = FORM_STEPS.length;

  const renderStep = () => {
    // ── Step 0: Template Selection ──────────────────────────────────────────
    if (step === 0) return (
      <div className="space-y-8">
        {/* Hero header */}
        <div className="text-center py-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Step 1 of 7</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pick Your Design</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">Your template sets the first impression. Choose one that fits your story.</p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-5">
          {TEMPLATES.map(tpl => (
            <TemplateCard key={tpl.id} tpl={tpl} selected={selectedTemplate === tpl.id}
              onSelect={setSelectedTemplate} accent={accentColor} />
          ))}
        </div>

        {/* Accent Colour panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor + '20' }}>
              <Palette size={15} style={{ color: accentColor }} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">Accent Colour</p>
              <p className="text-[10px] text-slate-400">Applied to headings, borders, and highlights across your resume.</p>
            </div>
            {/* Live colour preview badge */}
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black text-white shadow-sm" style={{ backgroundColor: accentColor }}>
              <span>{accentColor.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {ACCENT_PRESETS.map(c => (
              <button key={c} onClick={() => setAccentColor(c)}
                title={c}
                className={`w-8 h-8 rounded-full transition-all hover:scale-110 relative ${
                  accentColor === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-900' : ''
                }`}
                style={{ backgroundColor: c }}
              >
                {accentColor === c && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </span>
                )}
              </button>
            ))}
            <label className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-slate-300 rounded-full cursor-pointer hover:border-slate-400 transition-colors text-[10px] font-black text-slate-500">
              <Palette size={12} /> Custom
              <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-0 h-0 opacity-0 absolute" />
            </label>
          </div>
        </div>

        {/* Selected template summary */}
        {(() => {
          const t = TEMPLATES.find(t => t.id === selectedTemplate);
          return t ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
              <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
              <div>
                <p className="text-xs font-black text-slate-900">{t.name} selected</p>
                <p className="text-[10px] text-slate-400">{t.desc}</p>
              </div>
              {(t.sidebar || t.bold) && (
                <span className="ml-auto text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider bg-violet-50 text-violet-600 border border-violet-200">
                  Supports Photo
                </span>
              )}
            </div>
          ) : null;
        })()}
      </div>
    );

    // ── Step 1: Personal Info ────────────────────────────────────────────────
    if (step === 1) return (
      <div className="space-y-6">
        <div><h3 className="text-xl font-black text-slate-900">Personal Info</h3><p className="text-slate-400 text-sm">Your identity and contact details.</p></div>

        {/* Photo upload — only for templates that support it */}
        {supportsPhoto && (
          <div className="flex items-center gap-5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            {/* Preview */}
            <div className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden border-2 border-slate-300 bg-slate-100 flex items-center justify-center">
              {photo
                ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                : <User size={28} className="text-slate-400" />
              }
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-slate-700 mb-1">Profile Photo</p>
              <p className="text-[10px] text-slate-400 mb-3">Shown in the <span className="font-bold capitalize">{selectedTemplate}</span> template. Auto-loaded from your profile.</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                <User size={12} /> {photo ? 'Change Photo' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {photo && (
                <button onClick={() => setPhoto(null)} className="ml-2 px-3 py-2 text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded hover:bg-rose-50 transition-colors">
                  Remove
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Full Name"      icon={User}     value={formData.personalInfo.fullName}  onChange={e=>setPI('fullName',e.target.value)}  placeholder="John Doe" />
          <Field label="Job Title"      icon={Briefcase}value={formData.personalInfo.jobTitle}  onChange={e=>setPI('jobTitle',e.target.value)}  placeholder="Software Engineer" />
          <Field label="Email"          icon={Mail}     value={formData.personalInfo.email}     onChange={e=>setPI('email',e.target.value)}     placeholder="john@example.com" />
          <Field label="Phone"          icon={Phone}    value={formData.personalInfo.phone}     onChange={e=>setPI('phone',e.target.value)}     placeholder="+91 98765 43210" />
          <Field label="Location"       icon={MapPin}   value={formData.personalInfo.location}  onChange={e=>setPI('location',e.target.value)}  placeholder="City, State, Country" />
          <Field label="LinkedIn"       icon={Linkedin} value={formData.personalInfo.linkedin}  onChange={e=>setPI('linkedin',e.target.value)}  placeholder="linkedin.com/in/..." />
          <Field label="GitHub"         icon={Github}   value={formData.personalInfo.github}    onChange={e=>setPI('github',e.target.value)}    placeholder="github.com/..." />
        </div>
        <Field label="Professional Summary" type="textarea" rows={4} value={formData.personalInfo.summary} onChange={e=>setPI('summary',e.target.value)} placeholder="A passionate engineer who..." />
      </div>
    );

    // ── Step 2: Education ────────────────────────────────────────────────────
    if (step === 2) return (
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div><h3 className="text-xl font-black text-slate-900">Education</h3><p className="text-slate-400 text-sm">Degrees & qualifications.</p></div>
          <button onClick={()=>addItem('education',{degree:'',institution:'',startDate:'',endDate:'',gpa:''})} className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors"><Plus size={13}/>Add</button>
        </div>
        {formData.education.map((edu, i) => (
          <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded space-y-4 relative group">
            {formData.education.length > 1 && <button onClick={()=>removeItem('education',i)} className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={13}/></button>}
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Degree / Certificate" value={edu.degree} onChange={e=>setListItem('education',i,'degree',e.target.value)} placeholder="B.Sc Computer Science" />
              <Field label="Institution" value={edu.institution} onChange={e=>setListItem('education',i,'institution',e.target.value)} placeholder="MIT" />
              <Field label="Start Year" value={edu.startDate} onChange={e=>setListItem('education',i,'startDate',e.target.value)} placeholder="2018" />
              <Field label="End Year / Expected" value={edu.endDate} onChange={e=>setListItem('education',i,'endDate',e.target.value)} placeholder="2022" />
              <Field label="GPA / Percentage" value={edu.gpa} onChange={e=>setListItem('education',i,'gpa',e.target.value)} placeholder="8.5 / 10" />
            </div>
          </div>
        ))}
      </div>
    );

    // ── Step 3: Experience ───────────────────────────────────────────────────
    if (step === 3) return (
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div><h3 className="text-xl font-black text-slate-900">Work Experience</h3><p className="text-slate-400 text-sm">Roles, responsibilities and impact.</p></div>
          <button onClick={()=>addItem('experience',{jobTitle:'',company:'',startDate:'',endDate:'',description:''})} className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors"><Plus size={13}/>Add</button>
        </div>
        {formData.experience.map((exp, i) => (
          <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded space-y-4 relative group">
            {formData.experience.length > 1 && <button onClick={()=>removeItem('experience',i)} className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={13}/></button>}
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Job Title" value={exp.jobTitle} onChange={e=>setListItem('experience',i,'jobTitle',e.target.value)} placeholder="Senior Developer" />
              <Field label="Company" value={exp.company} onChange={e=>setListItem('experience',i,'company',e.target.value)} placeholder="Google" />
              <Field label="Start Date" value={exp.startDate} onChange={e=>setListItem('experience',i,'startDate',e.target.value)} placeholder="Jan 2021" />
              <Field label="End Date" value={exp.endDate} onChange={e=>setListItem('experience',i,'endDate',e.target.value)} placeholder="Present" />
            </div>
            <Field label="Description" type="textarea" rows={3} value={exp.description} onChange={e=>setListItem('experience',i,'description',e.target.value)} placeholder="Led a team of 5 engineers to deliver..." />
          </div>
        ))}
      </div>
    );

    // ── Step 4: Skills & Languages ───────────────────────────────────────────
    if (step === 4) return (
      <div className="space-y-6">
        <div><h3 className="text-xl font-black text-slate-900">Skills & Languages</h3><p className="text-slate-400 text-sm">Comma-separated lists.</p></div>
        <Field label="Technical & Soft Skills" type="textarea" rows={4} value={formData.skills} onChange={e=>setFormData(p=>({...p,skills:e.target.value}))} placeholder="React, Node.js, Python, Team Leadership, Agile..." />
        {formData.skills && (
          <div className="flex flex-wrap gap-2">
            {formData.skills.split(',').filter(s=>s.trim()).map((s,i)=>(
              <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-full">{s.trim()}</span>
            ))}
          </div>
        )}
        <Field label="Languages Spoken" type="textarea" rows={2} value={formData.languages} onChange={e=>setFormData(p=>({...p,languages:e.target.value}))} placeholder="English, Hindi, Spanish..." />
      </div>
    );

    // ── Step 5: Certifications ────────────────────────────────────────────────
    if (step === 5) return (
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div><h3 className="text-xl font-black text-slate-900">Certifications</h3><p className="text-slate-400 text-sm">Awards, courses and badges.</p></div>
          <button onClick={()=>addItem('certifications',{name:'',issuer:'',year:''})} className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors"><Plus size={13}/>Add</button>
        </div>
        {formData.certifications.map((cert, i) => (
          <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded space-y-3 relative group">
            {formData.certifications.length > 1 && <button onClick={()=>removeItem('certifications',i)} className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={13}/></button>}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2"><Field label="Certification Name" value={cert.name} onChange={e=>setListItem('certifications',i,'name',e.target.value)} placeholder="AWS Solutions Architect" /></div>
              <Field label="Year" value={cert.year} onChange={e=>setListItem('certifications',i,'year',e.target.value)} placeholder="2023" />
            </div>
            <Field label="Issuing Body" value={cert.issuer} onChange={e=>setListItem('certifications',i,'issuer',e.target.value)} placeholder="Amazon Web Services" />
          </div>
        ))}
      </div>
    );

    // ── Step 6: Preview & Export ─────────────────────────────────────────────
    if (step === 6) return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">Preview & Export</h3>
            <p className="text-slate-400 text-sm">Review your resume and download as PDF.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setShowPDFViewer(!showPDFViewer)} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              {showPDFViewer ? <X size={15}/> : <Eye size={15}/>}
              {showPDFViewer ? 'Close Preview' : 'Live Preview'}
            </button>
            <button onClick={handleSaveToProfile} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded font-bold text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm">
              {saving ? <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"/> : <Save size={15}/>}
              Save to Profile
            </button>
            <PDFDownloadLink
              document={<ActiveTemplate data={templateData} />}
              fileName={`${formData.personalInfo.fullName.replace(/\s+/g,'_')||'resume'}_elevate.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <button disabled={pdfLoading} className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 text-white rounded font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
                  <Download size={15}/>
                  {pdfLoading ? 'Preparing...' : 'Download PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        {showPDFViewer && (
          <div className="border border-slate-200 rounded overflow-hidden shadow-lg" style={{ height: '80vh' }}>
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              <ActiveTemplate data={templateData} />
            </PDFViewer>
          </div>
        )}

        {!showPDFViewer && (
          <div className="border-2 border-dashed border-slate-200 rounded-lg py-20 text-center bg-slate-50">
            <FileText size={40} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-sm">Click "Live Preview" to see your resume</p>
            <p className="text-slate-400 text-xs mt-1">Or download the PDF directly</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
            Resume Builder
          </h2>
          <p className="text-slate-500 text-sm">Build a professional resume in minutes.</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {FORM_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={i}>
              <button
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  step === i ? 'bg-slate-900 text-white shadow' : step > i ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={11} />
                {s.title}
                {step > i && <Check size={10} className="text-emerald-500" />}
              </button>
              {i < totalSteps - 1 && <div className={`h-px flex-1 min-w-[10px] rounded ${step > i ? 'bg-slate-400' : 'bg-slate-200'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 min-h-[480px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded font-bold text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors">
          <ChevronLeft size={15} /> Back
        </button>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          Step {step + 1} of {totalSteps}
        </span>
        {step < totalSteps - 1
          ? <button onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm">
              Next <ChevronRight size={15} />
            </button>
          : null
        }
      </div>
    </div>
  );
};

export default ResumeBuilder;
