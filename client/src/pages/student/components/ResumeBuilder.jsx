import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  Linkedin,
  Trash2,
  Save,
  Rocket,
  ArrowRight,
  Award,
  Layers
} from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

// Memoized Input Component for performance
const MemoizedInput = React.memo(({
  type = "text",
  value,
  onChange,
  placeholder,
  className,
  rows,
  icon: Icon
}) => {
  const baseClasses = "w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors shadow-sm placeholder:text-slate-400 text-slate-700";

  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-[14px] text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Icon size={14} />
        </div>
      )}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          rows={rows || 4}
          className={`${baseClasses} ${Icon ? '' : 'pl-4'}`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${Icon ? '' : 'pl-4'}`}
          placeholder={placeholder}
        />
      )}
    </div>
  );
});

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      summary: ''
    },
    education: [
      { degree: '', institution: '', year: '', gpa: '', achievements: '' }
    ],
    experience: [
      { title: '', company: '', duration: '', description: '' }
    ],
    skills: '',
    projects: [
      { name: '', description: '', technologies: '', link: '' }
    ],
    certifications: [
      { name: '', issuer: '', year: '' }
    ]
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { toPDF, targetRef } = usePDF({
    filename: `${formData.personalInfo.fullName.replace(/\s+/g, '_') || 'resume'}_elevate.pdf`,
    method: 'save',
    page: { margin: 10 },
    canvas: { mimeType: 'image/jpeg', quality: 0.98, useCORS: true }
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getProfile();

      if (response.success && response.data) {
        const p = response.data;
        const formatAddress = (addr) => {
          if (!addr) return '';
          if (typeof addr === 'string') return addr;
          if (typeof addr === 'object') {
            return [addr.city, addr.state, addr.country].filter(Boolean).join(', ') || JSON.stringify(addr);
          }
          return String(addr);
        };

        setFormData({
          personalInfo: {
            fullName: p.name || '',
            email: p.email || '',
            phone: p.phone || '',
            address: formatAddress(p.address),
            linkedin: p.linkedin || '',
            summary: p.summary || ''
          },
          education: p.education?.length ? p.education : [{ degree: '', institution: '', year: '', gpa: '', achievements: '' }],
          experience: p.experience?.length ? p.experience : [{ title: '', company: '', duration: '', description: '' }],
          skills: (() => {
            if (!p.skills) return '';
            if (p.skills.technicalSkills) {
              return [...(p.skills.technicalSkills || []), ...(p.skills.softSkills || [])].join(', ');
            }
            return Array.isArray(p.skills) ? p.skills.join(', ') : p.skills;
          })(),
          projects: p.projects?.length ? p.projects : [{ name: '', description: '', technologies: '', link: '' }],
          certifications: p.certifications?.length ? p.certifications : [{ name: '', issuer: '', year: '' }]
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile intelligence');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback((section, field, value, index = null) => {
    setFormData(prev => {
      if (index !== null) {
        const list = [...(prev[section] || [])];
        list[index] = { ...list[index], [field]: value };
        return { ...prev, [section]: list };
      }
      if (section === 'skills') return { ...prev, skills: value };
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  }, []);

  const addItem = (section) => {
    const empty = {
      education: { degree: '', institution: '', year: '', gpa: '', achievements: '' },
      experience: { title: '', company: '', duration: '', description: '' },
      projects: { name: '', description: '', technologies: '', link: '' },
      certifications: { name: '', issuer: '', year: '' }
    }[section];
    setFormData(prev => ({ ...prev, [section]: [...(prev[section] || []), empty] }));
  };

  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const steps = [
    { id: 0, title: 'Identity', icon: User, color: 'blue' },
    { id: 1, title: 'Academia', icon: GraduationCap, color: 'indigo' },
    { id: 2, title: 'Work', icon: Briefcase, color: 'purple' },
    { id: 3, title: 'Expertise', icon: Star, color: 'amber' },
    { id: 4, title: 'Portfolio', icon: Layers, color: 'emerald' },
    { id: 5, title: 'Awards', icon: Award, color: 'rose' }
  ];

  const validateStep = (step) => {
    switch (step) {
      case 0: // Personal Info
        if (!formData.personalInfo.fullName?.trim()) { toast.error('Full Name is required'); return false; }
        if (!formData.personalInfo.email?.trim()) { toast.error('Email is required'); return false; }
        if (!formData.personalInfo.phone?.trim()) { toast.error('Phone number is required'); return false; }
        if (!formData.personalInfo.address) { toast.error('Address is required'); return false; }
        return true;
      case 1: // Education
        const validEdu = formData.education.some(edu => edu.degree?.trim() && edu.institution?.trim() && edu.year?.trim());
        if (!validEdu) { toast.error('Please add at least one education qualification'); return false; }
        return true;
      case 2: // Experience
        // Optional, but if filled, must be complete
        const filledExp = formData.experience.filter(exp => exp.title || exp.company);
        const validExp = filledExp.every(exp => exp.title?.trim() && exp.company?.trim());
        if (!validExp) { toast.error('Please complete the details for all added experience entries'); return false; }
        return true;
      case 3: // Skills
        if (!formData.skills?.trim()) { toast.error('Please add your skills'); return false; }
        return true;
      case 4: // Projects
        const filledProj = formData.projects.filter(p => p.name || p.description);
        const validProj = filledProj.every(p => p.name?.trim() && p.description?.trim());
        if (filledProj.length > 0 && !validProj) { toast.error('Please complete the details for all added projects'); return false; }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => Math.min(s + 1, steps.length - 1));
    }
  };
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleSaveToProfile = async () => {
    try {
      setSaving(true);
      const loadingToast = toast.loading('Synchronizing with database...');
      const payload = {
        name: formData.personalInfo.fullName,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone,
        phoneNumber: formData.personalInfo.phone,
        summary: formData.personalInfo.summary,
        personalInfo: {
          phone: formData.personalInfo.phone,
          address: { city: formData.personalInfo.address }
        },
        links: {
          linkedin: formData.personalInfo.linkedin
        },
        education: formData.education,
        experience: formData.experience,
        skills: {
          technicalSkills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        },
        projects: formData.projects,
        certifications: formData.certifications
      };

      await studentApi.updateProfile(payload);
      toast.success("Resume data synchronized with profile!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="w-12 h-12 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Resume Engine...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            Resume Architect
          </h2>
          <p className="text-gray-500 font-medium tracking-tight">Constructing your professional narrative for global opportunities.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {showPreview ? <FileText size={18} /> : <Eye size={18} />}
            {showPreview ? 'Edit Assets' : 'Live Preview'}
          </button>
          {showPreview && (
            <div className="flex gap-2">
              <button
                onClick={handleSaveToProfile}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded shadow-sm hover:bg-slate-50 transition-colors font-bold text-sm disabled:opacity-50"
              >
                {saving ? <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save to Profile'}
              </button>
              <button
                onClick={toPDF}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded shadow-sm hover:bg-slate-800 transition-colors font-bold text-sm"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {!showPreview ? (
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Stepper Side Rail */}
          <div className="lg:col-span-1 space-y-2 sticky top-24">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`w-full flex items-center gap-4 p-4 rounded transition-colors group relative overflow-hidden ${currentStep === s.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 shadow-sm'
                  }`}
              >
                <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 transition-colors ${currentStep === s.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200 text-slate-600'
                  }`}>
                  <s.icon size={18} />
                </div>
                <div className="text-left min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${currentStep === s.id ? 'text-slate-300' : 'text-slate-400'}`}>Step 0{s.id + 1}</p>
                  <p className="font-bold text-sm truncate">{s.title}</p>
                </div>
                {currentStep > s.id && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Check size={14} className="text-emerald-500" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div className="lg:col-span-3 space-y-6" key={currentStep}>
            {/* Dynamic Step Content */}
            <div className="bg-white border border-slate-200 shadow-sm rounded p-8 md:p-10 relative overflow-hidden min-h-[500px]">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
                <Rocket size={200} />
              </div>

              {/* Step 0: Personal Info */}
              {currentStep === 0 && (
                <div className="space-y-8 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Identity & Contact</h3>
                    <p className="text-gray-500 text-sm">Vital stats for recruiter communication lines.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <MemoizedInput label="Full Name" icon={User} value={formData.personalInfo.fullName} onChange={e => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder="John Doe" />
                    <MemoizedInput label="Email Architecture" icon={Mail} value={formData.personalInfo.email} onChange={e => handleInputChange('personalInfo', 'email', e.target.value)} placeholder="john@example.com" />
                    <MemoizedInput label="Mobile Line" icon={Phone} value={formData.personalInfo.phone} onChange={e => handleInputChange('personalInfo', 'phone', e.target.value)} placeholder="+91 98765 43210" />
                    <MemoizedInput label="Professional HQ" icon={MapPin} value={formData.personalInfo.address} onChange={e => handleInputChange('personalInfo', 'address', e.target.value)} placeholder="City, State, Country" />
                  </div>

                  <MemoizedInput label="LinkedIn Protocol" icon={Linkedin} value={formData.personalInfo.linkedin} onChange={e => handleInputChange('personalInfo', 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/profile" />

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Career Signature (Summary)</label>
                    <MemoizedInput type="textarea" rows={5} value={formData.personalInfo.summary} onChange={e => handleInputChange('personalInfo', 'summary', e.target.value)} placeholder="Synthesize your core value proposition in 3-4 sentences..." />
                  </div>
                </div>
              )}

              {/* Step 1: Education */}
              {currentStep === 1 && (
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-end mb-6">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">Academic History</h3>
                       <p className="text-slate-500 text-sm">Institutional milestones and scholarly achievements.</p>
                    </div>
                    <button onClick={() => addItem('education')} className="p-3 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-900 hover:text-white transition-colors shadow-sm">
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.education.map((edu, i) => (
                      <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded space-y-4 hover:border-slate-300 transition-colors relative group">
                        <button onClick={() => removeItem('education', i)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded border border-slate-200 shadow-sm">
                          <Trash2 size={14} />
                        </button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <MemoizedInput value={edu.degree} onChange={e => handleInputChange('education', 'degree', e.target.value, i)} placeholder="Degree / Certificate" />
                          <MemoizedInput value={edu.institution} onChange={e => handleInputChange('education', 'institution', e.target.value, i)} placeholder="University / Institute" />
                          <MemoizedInput value={edu.year} onChange={e => handleInputChange('education', 'year', e.target.value, i)} placeholder="Graduation Year (e.g. 2024)" />
                          <MemoizedInput value={edu.gpa} onChange={e => handleInputChange('education', 'gpa', e.target.value, i)} placeholder="GPA / Percentage" />
                        </div>
                        <MemoizedInput type="textarea" rows={2} value={edu.achievements} onChange={e => handleInputChange('education', 'achievements', e.target.value, i)} placeholder="Key academic highlights..." />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Experience */}
              {currentStep === 2 && (
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-end mb-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Work Experience</h3>
                      <p className="text-slate-500 text-sm">Professional impact and industry exposure.</p>
                    </div>
                    <button onClick={() => addItem('experience')} className="p-3 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-900 hover:text-white transition-colors shadow-sm">
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.experience.map((exp, i) => (
                      <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded space-y-4 hover:border-slate-300 transition-colors relative group">
                        <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded border border-slate-200 shadow-sm">
                          <Trash2 size={14} />
                        </button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <MemoizedInput value={exp.title} onChange={e => handleInputChange('experience', 'title', e.target.value, i)} placeholder="Job Title / Role" />
                          <MemoizedInput value={exp.company} onChange={e => handleInputChange('experience', 'company', e.target.value, i)} placeholder="Organization Name" />
                          <MemoizedInput value={exp.duration} onChange={e => handleInputChange('experience', 'duration', e.target.value, i)} placeholder="Timeline (e.g. June 2023 - Present)" />
                        </div>
                        <MemoizedInput type="textarea" rows={4} value={exp.description} onChange={e => handleInputChange('experience', 'description', e.target.value, i)} placeholder="Describe your responsibilities and quantified achievements..." />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Skills */}
              {currentStep === 3 && (
                <div className="space-y-8 relative z-10">
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Expertise Engine</h3>
                    <p className="text-slate-500 text-sm">Comma-separated skills matrix. Think technical & behavioral.</p>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-6">
                    <MemoizedInput
                      type="textarea"
                      rows={8}
                      value={formData.skills}
                      onChange={e => handleInputChange('skills', '', e.target.value)}
                      placeholder="React, Node.js, Python, AWS, System Design, Strategic Communication, Agile..."
                    />
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(formData.skills.split(',')).filter(s => s.trim()).map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-[10px] uppercase tracking-widest rounded shadow-sm">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Projects */}
              {currentStep === 4 && (
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-end mb-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Project Portfolio</h3>
                      <p className="text-slate-500 text-sm">Demonstrating technical prowess through practical execution.</p>
                    </div>
                    <button onClick={() => addItem('projects')} className="p-3 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-900 hover:text-white transition-colors shadow-sm">
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.projects.map((proj, i) => (
                      <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded space-y-4 hover:border-slate-300 transition-colors relative group">
                        <button onClick={() => removeItem('projects', i)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded border border-slate-200 shadow-sm">
                          <Trash2 size={14} />
                        </button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <MemoizedInput value={proj.name} onChange={e => handleInputChange('projects', 'name', e.target.value, i)} placeholder="Project Designation" />
                          <MemoizedInput value={proj.technologies} onChange={e => handleInputChange('projects', 'technologies', e.target.value, i)} placeholder="Tech Stack (e.g. Next.js, Prisma)" />
                        </div>
                        <MemoizedInput value={proj.link} onChange={e => handleInputChange('projects', 'link', e.target.value, i)} placeholder="Live URL or Repository Link" />
                        <MemoizedInput type="textarea" rows={3} value={proj.description} onChange={e => handleInputChange('projects', 'description', e.target.value, i)} placeholder="Problem statement and your engineering solution..." />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Certifications */}
              {currentStep === 5 && (
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-end mb-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Awards & Badges</h3>
                      <p className="text-slate-500 text-sm">External validation of your expertise.</p>
                    </div>
                    <button onClick={() => addItem('certifications')} className="p-3 bg-slate-50 text-slate-600 rounded border border-slate-200 hover:bg-slate-900 hover:text-white transition-colors shadow-sm">
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.certifications.map((cert, i) => (
                      <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded space-y-4 hover:border-slate-300 transition-colors relative group">
                        <button onClick={() => removeItem('certifications', i)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded border border-slate-200 shadow-sm">
                          <Trash2 size={14} />
                        </button>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <MemoizedInput value={cert.name} onChange={e => handleInputChange('certifications', 'name', e.target.value, i)} placeholder="Certification Title" />
                          </div>
                          <MemoizedInput value={cert.year} onChange={e => handleInputChange('certifications', 'year', e.target.value, i)} placeholder="Year" />
                        </div>
                        <MemoizedInput value={cert.issuer} onChange={e => handleInputChange('certifications', 'issuer', e.target.value, i)} placeholder="Issuing Body (e.g. Microsoft, Coursera)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Navigation Buttons */}
            <div className="flex justify-between items-center bg-white border border-slate-200 p-6 rounded shadow-sm mt-6">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 rounded border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-3 px-8 py-3 bg-amber-500 border border-amber-600 text-white rounded font-bold uppercase text-xs tracking-widest hover:bg-amber-600 transition-colors shadow-sm"
                >
                  Verify Architecture
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-3 px-8 py-3 bg-slate-900 border border-slate-900 text-white rounded font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Deploy Next Step
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-8">


          {/* High Fidelity Resume Preview Canvas */}
          <div className="flex justify-center">
            <div
              ref={targetRef}
              className="w-[210mm] min-h-[297mm] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] p-[2.5cm] text-gray-800 font-serif leading-relaxed"
              style={{ fontFamily: "'Inter', 'Georgia', serif" }}
            >
              {/* Header */}
              <header className="text-center mb-10 border-b-4 border-slate-900 pb-8">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase mb-4">
                  {formData.personalInfo.fullName || 'RESUME ARCHITECT'}
                </h1>
                <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {formData.personalInfo.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {formData.personalInfo.email}</span>}
                  {formData.personalInfo.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {formData.personalInfo.phone}</span>}
                  {formData.personalInfo.address && <span className="flex items-center gap-1.5"><MapPin size={12} /> {formData.personalInfo.address}</span>}
                  {formData.personalInfo.linkedin && <span className="flex items-center gap-1.5 underline">{formData.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
                </div>
              </header>

              {/* Summary */}
              {formData.personalInfo.summary && (
                <section className="mb-10">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded inline-block mb-4">Perspective</h2>
                  <p className="text-sm font-medium leading-[1.8] text-slate-700">{formData.personalInfo.summary}</p>
                </section>
              )}

              {/* Experience */}
              {formData.experience.some(e => e.title) && (
                <section className="mb-10">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded inline-block mb-6">Experience</h2>
                  <div className="space-y-8">
                    {formData.experience.map((exp, i) => exp.title && (
                      <div key={i} className="relative pl-6 border-l-2 border-slate-100">
                        <div className="absolute top-0 left-[-5px] w-2 h-2 bg-slate-900 rounded-full"></div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base font-black text-slate-900">{exp.title}</h3>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.duration}</span>
                        </div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">{exp.company}</p>
                        <p className="text-xs font-medium leading-relaxed text-slate-600 whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {formData.education.some(e => e.degree) && (
                <section className="mb-10">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded inline-block mb-6">Academia</h2>
                  <div className="space-y-6">
                    {formData.education.map((edu, i) => edu.degree && (
                      <div key={i} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-sm font-black text-slate-900">{edu.degree}</h3>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mt-1">{edu.institution}</p>
                          {edu.achievements && <p className="text-[11px] text-slate-500 mt-2 italic">{edu.achievements}</p>}
                        </div>
                        <div className="text-right ml-10">
                          <p className="text-[10px] font-black text-slate-900">{edu.year}</p>
                          {edu.gpa && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills Grid */}
              {formData.skills && (
                <section className="mb-10">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded inline-block mb-6">Intelligence Matrix</h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.split(',').filter(s => s.trim()).map((s, i) => (
                      <span key={i} className="px-3 py-1.5 border-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {formData.projects.some(p => p.name) && (
                <section className="mb-10">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded inline-block mb-6">Protocol Deployments</h2>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                    {formData.projects.map((p, i) => p.name && (
                      <div key={i}>
                        <h3 className="text-sm font-black text-slate-900">{p.name}</h3>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{p.technologies}</p>
                        <p className="text-[11px] font-medium text-slate-600 mt-2 line-clamp-3">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {formData.certifications.some(c => c.name) && (
                <section>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] bg-slate-100 px-4 py-1.5 rounded inline-block mb-6">Validations</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.certifications.map((c, i) => c.name && (
                      <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                        <div>
                          <p className="text-[11px] font-black text-slate-900 leading-tight">{c.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{c.issuer}</p>
                        </div>
                        <span className="text-[10px] font-black text-slate-900 ml-4">{c.year}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
