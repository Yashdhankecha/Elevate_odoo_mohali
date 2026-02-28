import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X, ChevronRight, ChevronLeft, Save, Send, Loader2, CheckCircle2,
  AlertCircle, Building2, Briefcase, Users, Award, Calendar, FileText,
  Plus, Trash2, Upload, Eye, Info, Tag
} from 'lucide-react';
import { createJobPosting, updateJobPosting, saveJobDraft, getCompanyProfile } from '../../../services/companyApi';

// ===== CONSTANTS =====
const STEPS = [
  { id: 1, title: 'Company & Job Basics', icon: Building2 },
  { id: 2, title: 'Drive Type & Eligibility', icon: Users },
  { id: 3, title: 'Selection Process', icon: Award },
  { id: 4, title: 'Compensation & Details', icon: Briefcase },
  { id: 5, title: 'Dates & Requirements', icon: Calendar },
  { id: 6, title: 'Review & Submit', icon: FileText },
];

const INDUSTRIES = ['IT/Software', 'Finance/Banking', 'Manufacturing', 'Consulting', 'E-commerce', 'Healthcare', 'Education', 'Automobile', 'FMCG', 'Telecom', 'Media', 'Other'];
const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (<50)' },
  { value: 'small', label: 'Small (50-200)' },
  { value: 'medium', label: 'Medium (200-1000)' },
  { value: 'large', label: 'Large (1000+)' },
];
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product', 'Design', 'Other'];
const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
];
const JOB_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'non-technical', label: 'Non-Technical' },
  { value: 'management', label: 'Management' },
];
const BATCHES = ['2026', '2027', '2028'];
const DEGREES = ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'BCA', 'B.Sc', 'M.Sc', 'Other'];
const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'MBA-Finance', 'MBA-Marketing', 'MBA-HR', 'MCA', 'All Branches'];
const ROUND_TYPES = [
  { value: 'aptitude_test', label: 'Aptitude Test' },
  { value: 'technical_test', label: 'Technical Test' },
  { value: 'coding_round', label: 'Coding Round' },
  { value: 'group_discussion', label: 'Group Discussion' },
  { value: 'technical_interview', label: 'Technical Interview' },
  { value: 'hr_interview', label: 'HR Interview' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'other', label: 'Other' },
];
const EXPERIENCE_OPTIONS = [
  { value: '0', label: '0 years (Fresher)' },
  { value: '0-1', label: '0-1 years' },
  { value: '1-2', label: '1-2 years' },
  { value: '2-3', label: '2-3 years' },
  { value: 'other', label: 'Other' },
];
const ADDITIONAL_DOCS = ['Portfolio', 'Certificates', 'Project Links', 'GitHub Profile', 'LinkedIn Profile', 'Other'];

const INITIAL_FORM = {
  // Step 1
  companyName: '', companyWebsite: '', companyLogo: '', industry: '',
  companySize: '', companyDescription: '', companyLocation: '',
  jobTitle: '', department: '', employmentType: 'full-time', jobCategory: 'technical',
  // Step 2
  driveType: 'off_campus', targetBatches: [], eligibleDegrees: [], eligibleBranches: [],
  eligibilityCriteria: {
    minCgpaPercentage: { type: 'cgpa', value: 0 },
    backlogsAllowed: false, maxActiveBacklogs: 0,
    min10thPercentage: 0, min12thPercentage: 0,
    gapYearsAllowed: false, maxGapYears: 0,
    minAge: '', maxAge: '', otherCriteria: ''
  },
  // Step 3
  totalRounds: 1,
  selectionRounds: [{ roundNumber: 1, roundName: '', roundType: 'aptitude_test', duration: '', mode: 'online', platform: '', topics: '' }],
  // Step 4
  ctc: '', baseSalary: '', stipend: '', joiningBonus: '', performanceBonus: '',
  otherBenefits: '', jobDescription: '', requiredSkills: [], preferredSkills: [],
  experienceRequired: '0', numberOfOpenings: 1, workMode: 'office', workLocations: [''],
  internshipDuration: '', ppoPossibility: 'performance_based',
  bondRequired: false, bondDuration: '', bondAmount: '', bondDetails: '',
  // Step 5
  applicationDeadline: '', tentativeDriveDate: '', expectedJoiningDate: '', resultDeclarationDate: '',
  preferredDriveDateRange: { start: '', end: '' },
  venueRequirements: '', expectedStudents: '', pptRequired: false,
  pptDetails: { dateTime: '', duration: '', venue: '' },
  applicationPortalUrl: '', howToApply: '',
  resumeRequired: true, resumeFormat: 'any', coverLetterRequired: false,
  additionalDocuments: [], specialInstructions: '',
  hrName: '', contactEmail: '', contactPhone: '', alternateEmail: '', alternatePhone: '',
  // Meta
  termsAccepted: false
};

// ===== REUSABLE FORM ELEMENTS =====
const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-slate-400";
const labelClass = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";
const sectionClass = "bg-white rounded-2xl border border-slate-100 p-6 space-y-5";

const FormField = ({ label, required, children, hint }) => (
  <div className="space-y-1.5">
    <label className={labelClass}>{label}{required && <span className="text-rose-500 ml-0.5">*</span>}</label>
    {children}
    {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

const CheckboxGroup = ({ options, selected, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => {
      const val = typeof opt === 'string' ? opt : opt.value;
      const lbl = typeof opt === 'string' ? opt : opt.label;
      const checked = selected.includes(val);
      return (
        <button key={val} type="button"
          onClick={() => onChange(checked ? selected.filter(s => s !== val) : [...selected, val])}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${checked ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            }`}>{lbl}</button>
      );
    })}
  </div>
);

const RadioGroup = ({ options, value, onChange, name }) => (
  <div className="flex flex-wrap gap-3">
    {options.map(opt => {
      const val = typeof opt === 'string' ? opt : opt.value;
      const lbl = typeof opt === 'string' ? opt : opt.label;
      return (
        <label key={val} className={`relative flex flex-1 sm:flex-none items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium ${value === val ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}>
          <input type="radio" name={name} value={val} checked={value === val}
            onChange={() => onChange(val)} className="absolute opacity-0 w-0 h-0" />
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${value === val ? 'border-blue-600' : 'border-slate-300'
            }`}>
            {value === val && <div className="w-2 h-2 rounded-full bg-blue-600" />}
          </div>
          {lbl}
        </label>
      );
    })}
  </div>
);

const TagInput = ({ tags, onChange, placeholder }) => {
  const [input, setInput] = useState('');
  const addTag = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) { onChange([...tags, t]); setInput(''); }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-red-500"><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder={placeholder} className={inputClass} />
        <button type="button" onClick={addTag} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

// ===== STEP COMPONENTS =====
const Step1 = ({ form, setField, isUploadingTitle }) => {
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File must be under 2MB');
      return;
    }

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', file);
      // Replace with your actual Cloudinary upload preset and cloud name.
      // E.g., formData.append('upload_preset', 'my_preset');
      // fetch('https://api.cloudinary.com/v1_1/my_cloud_name/image/upload', ...)
      formData.append('upload_preset', 'elevate_preset');
      const response = await fetch('https://api.cloudinary.com/v1_1/ddwet1dzj/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.secure_url) {
        setField('companyLogo', data.secure_url);
      } else {
        // Fallback to Base64 if cloudinary fails or isn't set up yet
        const reader = new FileReader();
        reader.onload = ev => setField('companyLogo', ev.target.result);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Upload failed', err);
      // Fallback
      const reader = new FileReader();
      reader.onload = ev => setField('companyLogo', ev.target.result);
      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Building2 size={18} className="text-blue-600" /> Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Company Name" required>
            <input type="text" value={form.companyName} onChange={e => setField('companyName', e.target.value)} className={inputClass} placeholder="e.g., Infosys Ltd." />
          </FormField>
          <FormField label="Company Website / LinkedIn">
            <input type="url" value={form.companyWebsite} onChange={e => setField('companyWebsite', e.target.value)} className={inputClass} placeholder="https://..." />
          </FormField>
          <FormField label="Industry / Sector" required>
            <select value={form.industry} onChange={e => setField('industry', e.target.value)} className={inputClass}>
              <option value="">Select Industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </FormField>
          <FormField label="Company Size" required>
            <select value={form.companySize} onChange={e => setField('companySize', e.target.value)} className={inputClass}>
              <option value="">Select Size</option>
              {COMPANY_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </FormField>
          <FormField label="Company Location / HQ" required>
            <input type="text" value={form.companyLocation} onChange={e => setField('companyLocation', e.target.value)} className={inputClass} placeholder="e.g., Bengaluru, India" />
          </FormField>
          <FormField label="Company Logo" required hint="JPG, PNG. Max 2MB. Uploaded to Cloudinary.">
            <div className="flex items-center gap-3">
              {form.companyLogo && (
                <img src={form.companyLogo} alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200" />
              )}
              <div className="flex-1 relative">
                <input type="file" accept=".jpg,.jpeg,.png" onChange={handleLogoUpload} className={`${inputClass} ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploadingLogo} />
                {uploadingLogo && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={16} />}
              </div>
            </div>
          </FormField>
        </div>
        <FormField label="Company Description" required hint={`${form.companyDescription?.length || 0}/500`}>
          <textarea value={form.companyDescription} onChange={e => { if (e.target.value.length <= 500) setField('companyDescription', e.target.value); }}
            className={`${inputClass} min-h-[80px]`} placeholder="Brief description of the company..." />
        </FormField>
      </div>
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Briefcase size={18} className="text-emerald-600" /> Job Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Job Title / Role" required>
            <input type="text" value={form.jobTitle} onChange={e => setField('jobTitle', e.target.value)} className={inputClass} placeholder="e.g., Software Engineer" />
          </FormField>
          <FormField label="Department" required>
            <select value={form.department} onChange={e => setField('department', e.target.value)} className={inputClass}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
        </div>
        <FormField label="Employment Type" required>
          <RadioGroup options={EMPLOYMENT_TYPES} value={form.employmentType} onChange={v => setField('employmentType', v)} name="employmentType" />
        </FormField>
        <FormField label="Job Category" required>
          <RadioGroup options={JOB_CATEGORIES} value={form.jobCategory} onChange={v => setField('jobCategory', v)} name="jobCategory" />
        </FormField>
      </div>
    </div>
  );
};

const Step2 = ({ form, setField, setNested }) => (
  <div className="space-y-6">
    <div className={sectionClass}>
      <h3 className="text-base font-bold text-slate-800">Drive Type</h3>
      <RadioGroup options={[
        { value: 'on_campus', label: 'On-Campus (requires TPO approval)' },
        { value: 'off_campus', label: 'Off-Campus (directly visible to students)' }
      ]} value={form.driveType} onChange={v => setField('driveType', v)} name="driveType" />
    </div>
    <div className={sectionClass}>
      <h3 className="text-base font-bold text-slate-800">Target Audience</h3>
      <FormField label="Target Batch / Year" required>
        <CheckboxGroup options={BATCHES} selected={form.targetBatches} onChange={v => setField('targetBatches', v)} />
      </FormField>
      <FormField label="Eligible Degrees" required>
        <CheckboxGroup options={DEGREES} selected={form.eligibleDegrees} onChange={v => setField('eligibleDegrees', v)} />
      </FormField>
      <FormField label="Eligible Branches" required>
        <CheckboxGroup options={BRANCHES} selected={form.eligibleBranches} onChange={v => setField('eligibleBranches', v)} />
      </FormField>
    </div>
    <div className={sectionClass}>
      <h3 className="text-base font-bold text-slate-800">Eligibility Criteria</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Minimum CGPA / Percentage" required>
          <div className="flex gap-2">
            <select value={form.eligibilityCriteria.minCgpaPercentage.type} onChange={e => setNested('eligibilityCriteria.minCgpaPercentage.type', e.target.value)} className={`${inputClass} w-32`}>
              <option value="cgpa">CGPA</option><option value="percentage">Percentage</option>
            </select>
            <input type="number" value={form.eligibilityCriteria.minCgpaPercentage.value || ''} onChange={e => setNested('eligibilityCriteria.minCgpaPercentage.value', parseFloat(e.target.value) || 0)}
              className={inputClass} placeholder={form.eligibilityCriteria.minCgpaPercentage.type === 'cgpa' ? '0-10' : '0-100'}
              min="0" max={form.eligibilityCriteria.minCgpaPercentage.type === 'cgpa' ? 10 : 100} step="0.1" />
          </div>
        </FormField>
        <FormField label="Minimum 10th %">
          <input type="number" value={form.eligibilityCriteria.min10thPercentage || ''} onChange={e => setNested('eligibilityCriteria.min10thPercentage', parseFloat(e.target.value) || 0)}
            className={inputClass} min="0" max="100" placeholder="e.g., 60" />
        </FormField>
        <FormField label="Minimum 12th / Diploma %">
          <input type="number" value={form.eligibilityCriteria.min12thPercentage || ''} onChange={e => setNested('eligibilityCriteria.min12thPercentage', parseFloat(e.target.value) || 0)}
            className={inputClass} min="0" max="100" placeholder="e.g., 60" />
        </FormField>
        <FormField label="Minimum Age">
          <input type="number" value={form.eligibilityCriteria.minAge} onChange={e => setNested('eligibilityCriteria.minAge', parseInt(e.target.value) || '')} className={inputClass} placeholder="e.g., 18" min="15" max="60" />
        </FormField>
        <FormField label="Maximum Age">
          <input type="number" value={form.eligibilityCriteria.maxAge} onChange={e => setNested('eligibilityCriteria.maxAge', parseInt(e.target.value) || '')} className={inputClass} placeholder="e.g., 25" min="15" max="60" />
        </FormField>
      </div>
      <FormField label="Active Backlogs Allowed" required>
        <RadioGroup options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={form.eligibilityCriteria.backlogsAllowed ? 'yes' : 'no'}
          onChange={v => setNested('eligibilityCriteria.backlogsAllowed', v === 'yes')} name="backlogs" />
      </FormField>
      {form.eligibilityCriteria.backlogsAllowed && (
        <FormField label="Maximum Active Backlogs">
          <input type="number" value={form.eligibilityCriteria.maxActiveBacklogs || ''} onChange={e => setNested('eligibilityCriteria.maxActiveBacklogs', parseInt(e.target.value) || 0)} className={inputClass} min="0" />
        </FormField>
      )}
      <FormField label="Gap Years Allowed" required>
        <RadioGroup options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
          value={form.eligibilityCriteria.gapYearsAllowed ? 'yes' : 'no'}
          onChange={v => setNested('eligibilityCriteria.gapYearsAllowed', v === 'yes')} name="gapYears" />
      </FormField>
      {form.eligibilityCriteria.gapYearsAllowed && (
        <FormField label="Maximum Gap Years">
          <input type="number" value={form.eligibilityCriteria.maxGapYears || ''} onChange={e => setNested('eligibilityCriteria.maxGapYears', parseInt(e.target.value) || 0)} className={inputClass} min="0" />
        </FormField>
      )}
      <FormField label="Other Eligibility Criteria">
        <textarea value={form.eligibilityCriteria.otherCriteria} onChange={e => setNested('eligibilityCriteria.otherCriteria', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="Any additional criteria..." />
      </FormField>
    </div>
  </div>
);

const Step3 = ({ form, setField }) => {
  const updateRound = (idx, key, val) => {
    const rounds = [...form.selectionRounds];
    rounds[idx] = { ...rounds[idx], [key]: val };
    setField('selectionRounds', rounds);
  };
  const handleTotalRoundsChange = (num) => {
    const n = Math.max(1, Math.min(10, num));
    setField('totalRounds', n);
    const current = form.selectionRounds;
    if (n > current.length) {
      const added = Array.from({ length: n - current.length }, (_, i) => ({
        roundNumber: current.length + i + 1, roundName: '', roundType: 'aptitude_test', duration: '', mode: 'online', platform: '', topics: ''
      }));
      setField('selectionRounds', [...current, ...added]);
    } else {
      setField('selectionRounds', current.slice(0, n));
    }
  };

  return (
    <div className="space-y-6">
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Award size={18} className="text-purple-600" /> Selection Process</h3>
        <FormField label="Total Number of Rounds" required>
          <input type="number" value={form.totalRounds} onChange={e => handleTotalRoundsChange(parseInt(e.target.value) || 1)} className={`${inputClass} w-32`} min="1" max="10" />
        </FormField>
      </div>
      {form.selectionRounds.map((round, idx) => (
        <div key={idx} className={`${sectionClass} relative`}>
          <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">Round {idx + 1}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <FormField label="Round Name" required>
              <input type="text" value={round.roundName} onChange={e => updateRound(idx, 'roundName', e.target.value)} className={inputClass} placeholder="e.g., Online Aptitude Test" />
            </FormField>
            <FormField label="Round Type" required>
              <select value={round.roundType} onChange={e => updateRound(idx, 'roundType', e.target.value)} className={inputClass}>
                {ROUND_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </FormField>
            <FormField label="Duration">
              <input type="text" value={round.duration} onChange={e => updateRound(idx, 'duration', e.target.value)} className={inputClass} placeholder="e.g., 60 minutes" />
            </FormField>
            <FormField label="Mode" required>
              <RadioGroup options={[{ value: 'online', label: 'Online' }, { value: 'offline', label: 'Offline' }]} value={round.mode} onChange={v => updateRound(idx, 'mode', v)} name={`mode-${idx}`} />
            </FormField>
            <FormField label="Platform / Tool">
              <input type="text" value={round.platform} onChange={e => updateRound(idx, 'platform', e.target.value)} className={inputClass} placeholder="e.g., HackerRank, Google Meet" />
            </FormField>
          </div>
          <FormField label="Topics / Description">
            <textarea value={round.topics} onChange={e => updateRound(idx, 'topics', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="e.g., DSA, SQL, Java fundamentals" />
          </FormField>
        </div>
      ))}
    </div>
  );
};

const Step4 = ({ form, setField }) => {
  const isInternship = form.employmentType === 'internship';
  return (
    <div className="space-y-6">
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800">Compensation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {!isInternship ? (
            <>
              <FormField label="CTC (Cost to Company) ₹/annum" required>
                <input type="number" value={form.ctc} onChange={e => setField('ctc', e.target.value)} className={inputClass} placeholder="e.g., 600000" min="0" />
              </FormField>
              <FormField label="Base Salary ₹/annum">
                <input type="number" value={form.baseSalary} onChange={e => setField('baseSalary', e.target.value)} className={inputClass} placeholder="If different from CTC" min="0" />
              </FormField>
              <FormField label="Joining Bonus ₹">
                <input type="number" value={form.joiningBonus} onChange={e => setField('joiningBonus', e.target.value)} className={inputClass} min="0" />
              </FormField>
            </>
          ) : (
            <>
              <FormField label="Stipend ₹/month" required>
                <input type="number" value={form.stipend} onChange={e => setField('stipend', e.target.value)} className={inputClass} placeholder="e.g., 25000" min="0" />
              </FormField>
              <FormField label="CTC if converted ₹/annum">
                <input type="number" value={form.ctc} onChange={e => setField('ctc', e.target.value)} className={inputClass} min="0" />
              </FormField>
            </>
          )}
          <FormField label="Performance Bonus / Variable">
            <input type="text" value={form.performanceBonus} onChange={e => setField('performanceBonus', e.target.value)} className={inputClass} placeholder="e.g., Up to 20% of base" />
          </FormField>
        </div>
        <FormField label="Other Benefits">
          <textarea value={form.otherBenefits} onChange={e => setField('otherBenefits', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="Health insurance, relocation support..." />
        </FormField>
      </div>
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800">Job Details</h3>
        <FormField label="Job Description" required hint={`${form.jobDescription.length} chars (min 100)`}>
          <textarea value={form.jobDescription} onChange={e => setField('jobDescription', e.target.value)} className={`${inputClass} min-h-[140px]`} placeholder="Detailed responsibilities and day-to-day work..." />
        </FormField>
        <FormField label="Required Skills" required>
          <TagInput tags={form.requiredSkills} onChange={v => setField('requiredSkills', v)} placeholder="Type a skill and press Enter" />
        </FormField>
        <FormField label="Preferred Skills">
          <TagInput tags={form.preferredSkills} onChange={v => setField('preferredSkills', v)} placeholder="Optional preferred skills..." />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Experience Required">
            <select value={form.experienceRequired} onChange={e => setField('experienceRequired', e.target.value)} className={inputClass}>
              {EXPERIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label="Number of Openings" required>
            <input type="number" value={form.numberOfOpenings} onChange={e => setField('numberOfOpenings', parseInt(e.target.value) || 1)} className={inputClass} min="1" />
          </FormField>
        </div>
        <FormField label="Work Mode" required>
          <RadioGroup options={[{ value: 'office', label: 'Work from Office' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'remote', label: 'Remote' }]}
            value={form.workMode} onChange={v => setField('workMode', v)} name="workMode" />
        </FormField>
        <FormField label="Work Location(s)" required>
          {form.workLocations.map((loc, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="text" value={loc} onChange={e => { const locs = [...form.workLocations]; locs[i] = e.target.value; setField('workLocations', locs); }}
                className={inputClass} placeholder="City name" />
              {form.workLocations.length > 1 && (
                <button type="button" onClick={() => setField('workLocations', form.workLocations.filter((_, j) => j !== i))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setField('workLocations', [...form.workLocations, ''])} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={14} /> Add Location</button>
        </FormField>
      </div>
      {isInternship && (
        <div className={sectionClass}>
          <h3 className="text-base font-bold text-slate-800">Internship Details</h3>
          <FormField label="Internship Duration" required>
            <input type="text" value={form.internshipDuration} onChange={e => setField('internshipDuration', e.target.value)} className={inputClass} placeholder="e.g., 2 months" />
          </FormField>
          <FormField label="Possibility of PPO" required>
            <RadioGroup options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'performance_based', label: 'Performance Based' }]}
              value={form.ppoPossibility} onChange={v => setField('ppoPossibility', v)} name="ppo" />
          </FormField>
        </div>
      )}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800">Bond / Service Agreement</h3>
        <FormField label="Service Agreement / Bond Required" required>
          <RadioGroup options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
            value={form.bondRequired ? 'yes' : 'no'} onChange={v => setField('bondRequired', v === 'yes')} name="bond" />
        </FormField>
        {form.bondRequired && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Bond Duration" required>
              <input type="text" value={form.bondDuration} onChange={e => setField('bondDuration', e.target.value)} className={inputClass} placeholder="e.g., 2 years" />
            </FormField>
            <FormField label="Bond Amount ₹">
              <input type="number" value={form.bondAmount} onChange={e => setField('bondAmount', e.target.value)} className={inputClass} min="0" />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Bond Details">
                <textarea value={form.bondDetails} onChange={e => setField('bondDetails', e.target.value)} className={`${inputClass} min-h-[60px]`} />
              </FormField>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Step5 = ({ form, setField, setNested }) => {
  const isOnCampus = form.driveType === 'on_campus';
  return (
    <div className="space-y-6">
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800">Important Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Application Deadline" required>
            <input type="datetime-local" value={form.applicationDeadline} onChange={e => setField('applicationDeadline', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Expected Joining Date" required>
            <input type="date" value={form.expectedJoiningDate} onChange={e => setField('expectedJoiningDate', e.target.value)} className={inputClass} />
          </FormField>
          {isOnCampus && (
            <FormField label="Tentative Drive Date">
              <input type="date" value={form.tentativeDriveDate} onChange={e => setField('tentativeDriveDate', e.target.value)} className={inputClass} />
            </FormField>
          )}
          <FormField label="Result Declaration Date">
            <input type="date" value={form.resultDeclarationDate} onChange={e => setField('resultDeclarationDate', e.target.value)} className={inputClass} />
          </FormField>
        </div>
      </div>
      {isOnCampus ? (
        <div className={sectionClass}>
          <h3 className="text-base font-bold text-slate-800">On-Campus Drive Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Preferred Drive Date - Start" required>
              <input type="date" value={form.preferredDriveDateRange.start} onChange={e => setNested('preferredDriveDateRange.start', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Preferred Drive Date - End" required>
              <input type="date" value={form.preferredDriveDateRange.end} onChange={e => setNested('preferredDriveDateRange.end', e.target.value)} className={inputClass} />
            </FormField>
            <FormField label="Expected # of Students" required>
              <input type="number" value={form.expectedStudents} onChange={e => setField('expectedStudents', e.target.value)} className={inputClass} min="0" />
            </FormField>
          </div>
          <FormField label="Venue Requirements">
            <textarea value={form.venueRequirements} onChange={e => setField('venueRequirements', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="e.g., Seminar hall with projector" />
          </FormField>
          <FormField label="Pre-Placement Talk Required" required>
            <RadioGroup options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              value={form.pptRequired ? 'yes' : 'no'} onChange={v => setField('pptRequired', v === 'yes')} name="ppt" />
          </FormField>
          {form.pptRequired && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="PPT Date & Time" required>
                <input type="datetime-local" value={form.pptDetails.dateTime} onChange={e => setNested('pptDetails.dateTime', e.target.value)} className={inputClass} />
              </FormField>
              <FormField label="PPT Duration">
                <input type="text" value={form.pptDetails.duration} onChange={e => setNested('pptDetails.duration', e.target.value)} className={inputClass} placeholder="e.g., 30 minutes" />
              </FormField>
              <FormField label="PPT Venue / Mode" required>
                <input type="text" value={form.pptDetails.venue} onChange={e => setNested('pptDetails.venue', e.target.value)} className={inputClass} placeholder="e.g., Auditorium / Online via Zoom" />
              </FormField>
            </div>
          )}
        </div>
      ) : (
        <div className={sectionClass}>
          <h3 className="text-base font-bold text-slate-800">Off-Campus Application Info</h3>
          <FormField label="Application Portal URL" required>
            <input type="url" value={form.applicationPortalUrl} onChange={e => setField('applicationPortalUrl', e.target.value)} className={inputClass} placeholder="https://careers.company.com/apply" />
          </FormField>
          <FormField label="How to Apply Instructions" required>
            <textarea value={form.howToApply} onChange={e => setField('howToApply', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Step-by-step application process..." />
          </FormField>
        </div>
      )}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800">Application Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Resume Format">
            <select value={form.resumeFormat} onChange={e => setField('resumeFormat', e.target.value)} className={inputClass}>
              <option value="any">Any Format</option><option value="pdf">PDF Only</option><option value="doc">DOC/DOCX Only</option>
            </select>
          </FormField>
          <FormField label="Cover Letter Required">
            <RadioGroup options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              value={form.coverLetterRequired ? 'yes' : 'no'} onChange={v => setField('coverLetterRequired', v === 'yes')} name="coverLetter" />
          </FormField>
        </div>
        <FormField label="Additional Documents">
          <CheckboxGroup options={ADDITIONAL_DOCS} selected={form.additionalDocuments} onChange={v => setField('additionalDocuments', v)} />
        </FormField>
        <FormField label="Special Instructions for Students">
          <textarea value={form.specialInstructions} onChange={e => setField('specialInstructions', e.target.value)} className={`${inputClass} min-h-[60px]`} />
        </FormField>
      </div>
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-slate-800">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="HR / Recruiter Name" required>
            <input type="text" value={form.hrName} onChange={e => setField('hrName', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Contact Email" required>
            <input type="email" value={form.contactEmail} onChange={e => setField('contactEmail', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Contact Phone" required>
            <input type="tel" value={form.contactPhone} onChange={e => setField('contactPhone', e.target.value)} className={inputClass} placeholder="+91 XXXXXXXXXX" />
          </FormField>
          <FormField label="Alternate Email">
            <input type="email" value={form.alternateEmail} onChange={e => setField('alternateEmail', e.target.value)} className={inputClass} />
          </FormField>
          <FormField label="Alternate Phone">
            <input type="tel" value={form.alternatePhone} onChange={e => setField('alternatePhone', e.target.value)} className={inputClass} />
          </FormField>
        </div>
      </div>
    </div>
  );
};

const ReviewSection = ({ title, items, onEdit }) => (
  <div className={sectionClass}>
    <div className="flex justify-between items-center">
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <button type="button" onClick={onEdit} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Eye size={14} /> Edit</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.filter(i => i.value).map((item, i) => (
        <div key={i} className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
          <p className="text-sm font-medium text-slate-700 break-words">{Array.isArray(item.value) ? item.value.join(', ') : String(item.value)}</p>
        </div>
      ))}
    </div>
  </div>
);

const Step6 = ({ form, setField, goToStep }) => (
  <div className="space-y-6">
    <ReviewSection title="Company & Job Basics" onEdit={() => goToStep(1)} items={[
      { label: 'Company', value: form.companyName }, { label: 'Industry', value: form.industry },
      { label: 'Location', value: form.companyLocation }, { label: 'Job Title', value: form.jobTitle },
      { label: 'Department', value: form.department }, { label: 'Employment Type', value: form.employmentType },
      { label: 'Category', value: form.jobCategory },
    ]} />
    <ReviewSection title="Drive Type & Eligibility" onEdit={() => goToStep(2)} items={[
      { label: 'Drive Type', value: form.driveType === 'on_campus' ? 'On-Campus' : 'Off-Campus' },
      { label: 'Target Batches', value: form.targetBatches }, { label: 'Degrees', value: form.eligibleDegrees },
      { label: 'Branches', value: form.eligibleBranches },
      { label: 'Min CGPA/Percentage', value: `${form.eligibilityCriteria.minCgpaPercentage.value} (${form.eligibilityCriteria.minCgpaPercentage.type})` },
      { label: 'Backlogs', value: form.eligibilityCriteria.backlogsAllowed ? `Yes (max ${form.eligibilityCriteria.maxActiveBacklogs})` : 'No' },
      { label: 'Age Limit', value: form.eligibilityCriteria.minAge && form.eligibilityCriteria.maxAge ? `${form.eligibilityCriteria.minAge} - ${form.eligibilityCriteria.maxAge} years` : 'Not specified' },
    ]} />
    <ReviewSection title="Selection Process" onEdit={() => goToStep(3)} items={[
      { label: 'Total Rounds', value: form.totalRounds },
      ...form.selectionRounds.map((r, i) => ({ label: `Round ${i + 1}`, value: `${r.roundName} (${r.roundType}, ${r.mode})` }))
    ]} />
    <ReviewSection title="Compensation & Job Details" onEdit={() => goToStep(4)} items={[
      { label: form.employmentType === 'internship' ? 'Stipend' : 'CTC', value: form.employmentType === 'internship' ? (form.stipend ? `₹${form.stipend}/mo` : '') : (form.ctc ? `₹${form.ctc}/yr` : '') },
      { label: 'Openings', value: form.numberOfOpenings }, { label: 'Work Mode', value: form.workMode },
      { label: 'Locations', value: form.workLocations.filter(Boolean) },
      { label: 'Required Skills', value: form.requiredSkills }, { label: 'Bond', value: form.bondRequired ? `Yes - ${form.bondDuration}` : 'No' },
    ]} />
    <ReviewSection title="Dates & Requirements" onEdit={() => goToStep(5)} items={[
      { label: 'Deadline', value: form.applicationDeadline ? new Date(form.applicationDeadline).toLocaleString() : '' },
      { label: 'Joining Date', value: form.expectedJoiningDate }, { label: 'HR Contact', value: form.hrName },
      { label: 'Email', value: form.contactEmail }, { label: 'Phone', value: form.contactPhone },
    ]} />
    <div className={sectionClass}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={form.termsAccepted} onChange={e => setField('termsAccepted', e.target.checked)}
          className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
        <span className="text-sm text-slate-600">I confirm all information provided is accurate and I agree to the terms and conditions of the placement portal.</span>
      </label>
    </div>
  </div>
);

// ===== MAIN COMPONENT =====
const JobPostingForm = ({ job, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(() => job ? { ...INITIAL_FORM, ...job, termsAccepted: false } : { ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const autoSaveTimer = useRef(null);
  const savedJobId = useRef(job?._id || null);

  useEffect(() => {
    if (!job) {
      const fetchProfile = async () => {
        try {
          const profile = await getCompanyProfile();
          if (profile) {
            setForm(prev => ({
              ...prev,
              // Step 1
              companyName: profile.companyName || prev.companyName,
              companyWebsite: profile.website || prev.companyWebsite,
              companyLogo: profile.profilePicture || prev.companyLogo,
              industry: profile.industry || prev.industry,
              companySize: profile.companySize || prev.companySize,
              companyLocation: profile.headquartersLocation || (profile.address ? `${profile.address.city || ''} ${profile.address.state || ''}`.trim() : prev.companyLocation),
              companyDescription: profile.description || prev.companyDescription,

              // Step 2
              eligibleDegrees: profile.preferredDegrees?.length ? profile.preferredDegrees : prev.eligibleDegrees,
              eligibleBranches: profile.preferredBranches?.length ? profile.preferredBranches : prev.eligibleBranches,
              eligibilityCriteria: {
                ...prev.eligibilityCriteria,
                minCgpaPercentage: profile.defaultMinCGPA ? { type: 'cgpa', value: profile.defaultMinCGPA } : prev.eligibilityCriteria.minCgpaPercentage,
                backlogsAllowed: profile.backlogsAllowed !== undefined ? profile.backlogsAllowed : prev.eligibilityCriteria.backlogsAllowed,
                maxActiveBacklogs: profile.maxBacklogs || prev.eligibilityCriteria.maxActiveBacklogs,
                gapYearsAllowed: profile.gapYearsAllowed !== undefined ? profile.gapYearsAllowed : prev.eligibilityCriteria.gapYearsAllowed,
                maxGapYears: profile.maxGapYears || prev.eligibilityCriteria.maxGapYears,
              },

              // Step 4
              workLocations: profile.standardWorkLocations?.length ? profile.standardWorkLocations : prev.workLocations,
              workMode: profile.defaultWorkMode ? profile.defaultWorkMode.toLowerCase() : prev.workMode,
              otherBenefits: profile.standardBenefitsPackage || prev.otherBenefits,

              // Step 5
              resumeFormat: profile.resumeFormatPreference === 'PDF only' ? 'pdf' : (profile.resumeFormatPreference === 'DOC only' ? 'doc' : 'any'),
              additionalDocuments: profile.standardRequiredDocuments?.length ? profile.standardRequiredDocuments : prev.additionalDocuments,
              specialInstructions: profile.defaultSpecialInstructions || prev.specialInstructions,
              hrName: profile.hrName || prev.hrName,
              contactEmail: profile.hrEmail || profile.email || prev.contactEmail,
              contactPhone: profile.hrPhone || profile.contactNumber || prev.contactPhone,
              alternateEmail: profile.alternateEmail || prev.alternateEmail,
              alternatePhone: profile.alternatePhone || prev.alternatePhone,
            }));
          }
        } catch (error) {
          console.error('Failed to fetch company profile', error);
        }
      };
      fetchProfile();
    }
  }, [job]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const setField = useCallback((key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const setNested = useCallback((path, value) => {
    setForm(prev => {
      const keys = path.split('.');
      const newForm = { ...prev };
      let current = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newForm;
    });
  }, []);

  // Auto-save draft every 2 minutes
  useEffect(() => {
    if (savedJobId.current) {
      autoSaveTimer.current = setInterval(async () => {
        try {
          await saveJobDraft(savedJobId.current, form);
        } catch (e) { /* silent */ }
      }, 120000);
    }
    return () => clearInterval(autoSaveTimer.current);
  }, [form]);

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!form.companyName?.trim()) errs.companyName = 'Company name is required';
      if (!form.industry) errs.industry = 'Industry is required';
      if (!form.companySize) errs.companySize = 'Company size is required';
      if (!form.companyDescription?.trim() || form.companyDescription.length < 50) errs.companyDescription = 'Please provide a valid description (min 50 chars)';
      if (!form.companyLocation?.trim()) errs.companyLocation = 'Company location is required';
      if (!form.companyLogo) errs.companyLogo = 'Company logo is required';
      if (!form.jobTitle?.trim()) errs.jobTitle = 'Job title is required';
      if (!form.department) errs.department = 'Department is required';
      if (!form.employmentType) errs.employmentType = 'Employment type is required';
      if (!form.jobCategory) errs.jobCategory = 'Job category is required';
    } else if (step === 2) {
      if (!form.targetBatches.length) errs.targetBatches = 'Select at least one target batch';
      if (!form.eligibleDegrees.length) errs.eligibleDegrees = 'Select at least one eligible degree';
      if (!form.eligibleBranches.length) errs.eligibleBranches = 'Select at least one eligible branch';
      if (form.eligibilityCriteria.minCgpaPercentage.value === '' || form.eligibilityCriteria.minCgpaPercentage.value === null) {
        errs.minCgpaPercentage = 'Required';
      }
      if (form.eligibilityCriteria.backlogsAllowed && (form.eligibilityCriteria.maxActiveBacklogs === '' || form.eligibilityCriteria.maxActiveBacklogs < 0)) {
        errs.maxActiveBacklogs = 'Please specify max active backlogs';
      }
      if (form.eligibilityCriteria.gapYearsAllowed && (form.eligibilityCriteria.maxGapYears === '' || form.eligibilityCriteria.maxGapYears < 0)) {
        errs.maxGapYears = 'Please specify max gap years';
      }
      if (form.eligibilityCriteria.minAge && form.eligibilityCriteria.maxAge && form.eligibilityCriteria.minAge > form.eligibilityCriteria.maxAge) {
        errs.age = 'Minimum age cannot be greater than maximum age';
      }
    } else if (step === 3) {
      form.selectionRounds.forEach((r, i) => {
        if (!r.roundName?.trim()) errs[`round_${i}`] = 'Round name required';
        if (!r.roundType) errs[`round_${i}_type`] = 'Round type required';
        if (!r.mode) errs[`round_${i}_mode`] = 'Mode required';
      });
    } else if (step === 4) {
      if (form.employmentType === 'internship') {
        if (!form.stipend?.toString().trim()) errs.stipend = 'Stipend field is required';
        if (!form.internshipDuration?.trim()) errs.internshipDuration = 'Internship duration is required';
        if (!form.ppoPossibility) errs.ppoPossibility = 'PPO Possibility is required';
      } else {
        if (!form.ctc?.toString().trim()) errs.ctc = 'CTC is required';
      }
      if (!form.jobDescription?.trim() || form.jobDescription.length < 100) errs.jobDescription = 'Job description is required (min 100 characters)';
      if (!form.requiredSkills.length) errs.requiredSkills = 'Add at least one required skill';
      if (!form.workMode) errs.workMode = 'Work mode is required';
      const validLocations = form.workLocations.filter(l => l.trim() !== '');
      if (!validLocations.length && form.workMode !== 'remote') errs.workLocations = 'Add at least one location';
      if (!form.numberOfOpenings || form.numberOfOpenings < 1) errs.numberOfOpenings = 'Valid number of openings required';
      if (form.bondRequired && !form.bondDuration?.trim()) errs.bondDuration = 'Bond duration is required if bond is applicable';
    } else if (step === 5) {
      if (!form.applicationDeadline) errs.applicationDeadline = 'Application deadline is required';
      if (!form.expectedJoiningDate) errs.expectedJoiningDate = 'Expected joining date is required';
      if (form.driveType === 'on_campus') {
        if (!form.preferredDriveDateRange.start) errs.preferredDriveDateRange = 'Preferred drive start date is required';
        if (!form.preferredDriveDateRange.end) errs.preferredDriveDateRangeEnd = 'Preferred drive end date is required';
        if (!form.expectedStudents || form.expectedStudents < 1) errs.expectedStudents = 'Expected number of students required';
        if (form.pptRequired && (!form.pptDetails.dateTime || !form.pptDetails.venue?.trim())) errs.pptDetails = 'PPT Date, Time and Venue are required';
      } else {
        if (!form.applicationPortalUrl?.trim()) errs.applicationPortalUrl = 'Application portal URL is required';
        if (!form.howToApply?.trim()) errs.howToApply = 'Application instructions are required';
      }
      if (!form.hrName?.trim()) errs.hrName = 'HR/Recruiter name is required';
      if (!form.contactEmail?.trim() || !/^\S+@\S+\.\S+$/.test(form.contactEmail)) errs.contactEmail = 'Valid contact email is required';
      if (!form.contactPhone?.trim()) errs.contactPhone = 'Contact phone number is required';
    } else if (step === 6) {
      if (!form.termsAccepted) errs.terms = 'You must accept the terms and conditions';
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Create a readable error string for toast
      const firstError = Object.values(errs)[0];
      showToast(firstError, 'error');
      // Scroll to top of modal to see errors
      const modalContent = document.querySelector('.custom-scrollbar');
      if (modalContent) modalContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep) && currentStep < 6) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const goToStep = (s) => setCurrentStep(s);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      if (savedJobId.current) {
        await saveJobDraft(savedJobId.current, { ...form, status: 'draft' });
      } else {
        const result = await createJobPosting({ ...form, status: 'draft' });
        savedJobId.current = result._id;
      }
      showToast('Draft saved successfully');
    } catch (e) {
      showToast('Failed to save draft', 'error');
    } finally { setSaving(false); }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;
    setSubmitting(true);
    try {
      const status = form.driveType === 'on_campus' ? 'pending_approval' : 'active';
      if (savedJobId.current) {
        await updateJobPosting(savedJobId.current, { ...form, status });
      } else {
        await createJobPosting({ ...form, status });
      }
      showToast(form.driveType === 'on_campus' ? 'Submitted for TPO approval!' : 'Job published successfully!');
      setTimeout(() => onSuccess?.(), 1500);
    } catch (e) {
      const msg = e.response?.data?.details || e.response?.data?.message || e.message;
      showToast('Submission failed: ' + msg, 'error');
    } finally { setSubmitting(false); }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 form={form} setField={setField} />;
      case 2: return <Step2 form={form} setField={setField} setNested={setNested} />;
      case 3: return <Step3 form={form} setField={setField} />;
      case 4: return <Step4 form={form} setField={setField} />;
      case 5: return <Step5 form={form} setField={setField} setNested={setNested} />;
      case 6: return <Step6 form={form} setField={setField} goToStep={goToStep} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col relative z-10 shadow-2xl overflow-hidden">
        {/* Toast */}
        {toast && (
          <div className={`absolute top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-slide-left ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md flex-shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900">{job ? 'Edit Job Posting' : 'Create Job Posting'}</h2>
            <p className="text-xs text-slate-400 font-medium">Step {currentStep} of 6 — {STEPS[currentStep - 1].title}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400"><X size={20} /></button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 bg-white border-b border-slate-50 flex-shrink-0">
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;
              return (
                <React.Fragment key={step.id}>
                  <button onClick={() => goToStep(step.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : isDone ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}>
                    {isDone ? <CheckCircle2 size={12} /> : <Icon size={12} />}
                    <span className="hidden lg:inline">{step.title}</span>
                    <span className="lg:hidden">{step.id}</span>
                  </button>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded ${isDone ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle size={16} /> Please fix the highlighted errors before proceeding.
            </div>
          )}
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between gap-3 flex-shrink-0">
          <button type="button" onClick={handleSaveDraft} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
          </button>
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="flex items-center gap-1 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {currentStep < 6 ? (
              <button type="button" onClick={nextStep}
                className="flex items-center gap-1 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting || !form.termsAccepted}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {form.driveType === 'on_campus' ? 'Submit for Approval' : 'Publish Job'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
