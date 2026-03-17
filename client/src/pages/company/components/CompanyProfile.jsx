import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { getCompanyProfile, updateCompanyProfile, uploadCompanyLogo } from '../../../services/companyApi';
import {
  FaBuilding, FaGlobe, FaMapMarkerAlt, FaUsers, FaIndustry,
  FaSave, FaTimes, FaGraduationCap, FaBriefcase, FaAddressCard, FaFileAlt, FaEdit,
  FaCamera, FaSpinner
} from 'react-icons/fa';

const MOCK_DEGREES = ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'BCA', 'BBA'];
const MOCK_BRANCHES = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE', 'Finance', 'HR', 'Marketing'];
const MOCK_DOCS = ['Portfolio', 'Certificates', 'Cover Letter', 'Recommendation Letter'];

// Validates that a string is a proper URL (http/https)
const isValidUrl = (str) => {
  if (!str) return true; // empty is ok (not required here)
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const SectionWrapper = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden mb-6">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
      <div className="p-2 bg-slate-100 text-slate-700 rounded border border-slate-200">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingLogo, setSavingLogo] = useState(false);
  const [profile, setProfile] = useState(null);
  const [urlErrors, setUrlErrors] = useState({});
  const logoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Basic Info
    companyName: '',
    website: '',
    profilePicture: '',
    industry: '',
    companySize: '',
    headquartersLocation: '',
    description: '',

    // Eligibility
    defaultMinCGPA: '',
    backlogsAllowed: false,
    maxBacklogs: 0,
    gapYearsAllowed: false,
    maxGapYears: 0,
    preferredDegrees: [],
    preferredBranches: [],

    // Standard Job Details
    standardWorkLocations: [],
    workLocationInput: '',
    defaultWorkMode: 'Office',
    standardBenefitsPackage: '',

    // Default Company Contact (Receptionist)
    receptionistName: '',
    receptionistEmail: '',
    receptionistPhone: '',
    alternateEmail: '',
    alternatePhone: '',

    // Application Preferences
    resumeFormatPreference: 'Any',
    standardRequiredDocuments: [],
    defaultSpecialInstructions: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getCompanyProfile();
      setProfile(data);
      if (data) {
        setFormData({
          companyName: data.companyName || '',
          website: data.website || '',
          profilePicture: data.profilePicture || '',
          industry: data.industry || '',
          companySize: data.companySize || '',
          headquartersLocation: data.headquartersLocation || '',
          description: data.description || '',

          defaultMinCGPA: data.defaultMinCGPA || '',
          backlogsAllowed: data.backlogsAllowed || false,
          maxBacklogs: data.maxBacklogs || 0,
          gapYearsAllowed: data.gapYearsAllowed || false,
          maxGapYears: data.maxGapYears || 0,
          preferredDegrees: data.preferredDegrees || [],
          preferredBranches: data.preferredBranches || [],

          standardWorkLocations: data.standardWorkLocations || [],
          workLocationInput: '',
          defaultWorkMode: data.defaultWorkMode || 'Office',
          standardBenefitsPackage: data.standardBenefitsPackage || '',

          // Map legacy hrName/hrEmail/hrPhone → receptionist fields
          receptionistName: data.receptionistName || data.hrName || '',
          receptionistEmail: data.receptionistEmail || data.hrEmail || '',
          receptionistPhone: data.receptionistPhone || data.hrPhone || '',
          alternateEmail: data.alternateEmail || '',
          alternatePhone: data.alternatePhone || '',

          resumeFormatPreference: data.resumeFormatPreference || 'Any',
          standardRequiredDocuments: data.standardRequiredDocuments || [],
          defaultSpecialInstructions: data.defaultSpecialInstructions || ''
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Live URL validation for URL fields
    if (name === 'website' || name === 'linkedinUrl' || name === 'portfolioUrl') {
      if (value && !isValidUrl(value)) {
        setUrlErrors(prev => ({ ...prev, [name]: 'Please enter a valid URL (e.g. https://example.com)' }));
      } else {
        setUrlErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
      }
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const handleLocationsKeyDown = (e) => {
    if (e.key === 'Enter' && formData.workLocationInput.trim() !== '') {
      e.preventDefault();
      if (!formData.standardWorkLocations.includes(formData.workLocationInput.trim())) {
        setFormData(prev => ({
          ...prev,
          standardWorkLocations: [...prev.standardWorkLocations, prev.workLocationInput.trim()],
          workLocationInput: ''
        }));
      }
    }
  };

  const removeLocation = (locToRemove) => {
    setFormData(prev => ({
      ...prev,
      standardWorkLocations: prev.standardWorkLocations.filter(loc => loc !== locToRemove)
    }));
  };

  // Cloudinary logo upload handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic file validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setSavingLogo(true);
    try {
      const uploadedUrl = await uploadCompanyLogo(file);
      setFormData(prev => ({ ...prev, profilePicture: uploadedUrl }));
      setProfile(prev => prev ? { ...prev, profilePicture: uploadedUrl } : prev);
      toast.success('Company logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload logo. Please try again.');
    } finally {
      setSavingLogo(false);
    }
  };

  const handleSave = async () => {
    // Validate all URL fields before saving
    const urlFields = ['website'];
    let hasUrlErrors = false;
    const newUrlErrors = {};
    urlFields.forEach(field => {
      if (formData[field] && !isValidUrl(formData[field])) {
        newUrlErrors[field] = 'Please enter a valid URL (e.g. https://example.com)';
        hasUrlErrors = true;
      }
    });
    if (hasUrlErrors) {
      setUrlErrors(newUrlErrors);
      toast.error('Please fix URL errors before saving.');
      return;
    }

    try {
      const loadingToast = toast.loading('Saving profile...');
      const payload = { ...formData };
      delete payload.workLocationInput;

      // Map receptionist fields to also update legacy hrName/hrEmail/hrPhone for backward compat
      payload.hrName = payload.receptionistName;
      payload.hrEmail = payload.receptionistEmail;
      payload.hrPhone = payload.receptionistPhone;

      const updatedProfile = await updateCompanyProfile(payload);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile saved successfully', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Company Logo with Upload Button */}
          <div className="relative group">
            <div className="w-20 h-20 bg-slate-50 rounded border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
              {(formData.profilePicture || profile?.profilePicture) ? (
                <img
                  src={formData.profilePicture || profile?.profilePicture}
                  alt="Company Logo"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-3xl">🏢</span>
              )}
              {savingLogo && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                  <FaSpinner className="text-white animate-spin" size={20} />
                </div>
              )}
            </div>
            {/* Upload trigger — always visible */}
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={savingLogo}
              className="absolute -bottom-2 -right-2 p-2 bg-slate-900 hover:bg-slate-800 text-white rounded border border-slate-700 shadow-sm transition-colors disabled:opacity-60"
              title="Upload company logo"
            >
              <FaCamera size={12} />
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              aria-label="Upload company logo"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">{formData.companyName || 'Set up your Company Profile'}</h1>
            <p className="text-slate-500 text-sm mt-1">This information will be used to auto-fill your job postings.</p>
            <p className="text-slate-500 text-xs mt-0.5">Click the camera icon to upload your company logo</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded flex items-center gap-2 transition-colors font-bold shadow-sm"
            >
              <FaEdit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => { setIsEditing(false); setUrlErrors({}); }}
                className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded flex items-center gap-2 transition-colors font-bold border border-slate-300 shadow-sm"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded flex items-center gap-2 transition-colors font-bold shadow-sm"
              >
                <FaSave className="w-4 h-4" />
                Save Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`space-y-6 ${!isEditing ? 'opacity-90 pointer-events-none grayscale-[10%]' : ''}`}>

        {/* Section 1: Basic Company Info */}
        <SectionWrapper title="Basic Company Info" icon={FaBuilding}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. Acme Corp" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 ${urlErrors.website ? 'border-red-400 bg-red-50/30 focus:ring-red-400/30' : 'border-gray-300'}`}
                placeholder="e.g. https://acme.com"
              />
              {urlErrors.website && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {urlErrors.website}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry / Sector *</label>
              <select name="industry" value={formData.industry} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50">
                <option value="">Select Industry</option>
                <option value="IT/Software">IT / Software</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education">Education</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Consulting">Consulting</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size *</label>
              <select name="companySize" value={formData.companySize} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50">
                <option value="">Select Size</option>
                <option value="startup">Startup (1-50)</option>
                <option value="small">Small (51-200)</option>
                <option value="medium">Medium (201-1000)</option>
                <option value="large">Large (1001-5000)</option>
                <option value="enterprise">Enterprise (5000+)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters Location *</label>
              <input type="text" name="headquartersLocation" value={formData.headquartersLocation} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. Bangalore, Karnataka" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Description *</label>
              <p className="text-xs text-gray-500 mb-2">This becomes the default description for all job postings.</p>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="About your company..."></textarea>
            </div>
          </div>
        </SectionWrapper>

        {/* Section 2: Default Eligibility Criteria */}
        <SectionWrapper title="Default Eligibility Criteria" icon={FaGraduationCap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Minimum CGPA / Percentage *</label>
                <input type="number" name="defaultMinCGPA" value={formData.defaultMinCGPA} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. 7.5 or 75" />
              </div>

              <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="backlogsAllowed" checked={formData.backlogsAllowed} onChange={handleChange} className="w-5 h-5 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
                  <span className="text-sm font-bold text-slate-700">Backlogs Allowed by Default?</span>
                </label>
                {formData.backlogsAllowed && (
                  <div className="pl-8 transition-all">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Max Backlogs Allowed</label>
                    <input type="number" name="maxBacklogs" value={formData.maxBacklogs} onChange={handleChange} className="w-24 p-2 border border-slate-300 rounded text-sm bg-white" min="0" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="gapYearsAllowed" checked={formData.gapYearsAllowed} onChange={handleChange} className="w-5 h-5 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
                  <span className="text-sm font-bold text-slate-700">Gap Years Allowed by Default?</span>
                </label>
                {formData.gapYearsAllowed && (
                  <div className="pl-8 transition-all">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Max Gap Years</label>
                    <input type="number" name="maxGapYears" value={formData.maxGapYears} onChange={handleChange} className="w-24 p-2 border border-slate-300 rounded text-sm bg-white" min="0" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Degrees</label>
                <div className="flex flex-wrap gap-2">
                  {MOCK_DEGREES.map(degree => (
                    <label key={degree} className={`px-4 py-2 rounded border text-sm cursor-pointer transition-colors flex items-center gap-2 font-bold ${formData.preferredDegrees.includes(degree) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'}`}>
                      <input type="checkbox" className="hidden" checked={formData.preferredDegrees.includes(degree)} onChange={() => handleArrayToggle('preferredDegrees', degree)} />
                      {degree}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Branches</label>
                <div className="flex flex-wrap gap-2">
                  {MOCK_BRANCHES.map(branch => (
                    <label key={branch} className={`px-4 py-2 rounded border text-sm cursor-pointer transition-colors flex items-center gap-2 font-bold ${formData.preferredBranches.includes(branch) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'}`}>
                      <input type="checkbox" className="hidden" checked={formData.preferredBranches.includes(branch)} onChange={() => handleArrayToggle('preferredBranches', branch)} />
                      {branch}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Section 3: Standard Job Details */}
        <SectionWrapper title="Standard Job Details" icon={FaBriefcase}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typical Work Locations</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.standardWorkLocations.map((loc, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md flex items-center gap-2 text-sm border border-gray-200">
                    {loc}
                    <button type="button" onClick={() => removeLocation(loc)} className="text-gray-400 hover:text-red-500">&times;</button>
                  </span>
                ))}
              </div>
              <input type="text" name="workLocationInput" value={formData.workLocationInput} onChange={handleChange} onKeyDown={handleLocationsKeyDown} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="Type location and press Enter (e.g. Bangalore)" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Work Mode</label>
              <div className="flex gap-4">
                {['Office', 'Hybrid', 'Remote'].map(mode => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="defaultWorkMode" value={mode} checked={formData.defaultWorkMode === mode} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span className="text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard Benefits Package</label>
              <p className="text-xs text-gray-500 mb-2">This will auto-fill in the 'Other Benefits' section of the job form.</p>
              <textarea name="standardBenefitsPackage" value={formData.standardBenefitsPackage} onChange={handleChange} rows="3" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. Health Insurance, Gym Membership, Free Meals..."></textarea>
            </div>
          </div>
        </SectionWrapper>

        {/* Section 4: Default Company Contact (Receptionist) */}
        <SectionWrapper title="Default Company Contact" icon={FaAddressCard}>
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded">
            <p className="text-slate-600 text-sm font-bold">
              📞 These are the company's main front-desk / receptionist contact details — not HR-specific. They will appear as the primary contact in job postings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receptionist / Front Desk Name</label>
              <input type="text" name="receptionistName" value={formData.receptionistName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. Ms. Priya Verma" />
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receptionist / Contact Email</label>
              <input type="email" name="receptionistEmail" value={formData.receptionistEmail} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. reception@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receptionist / Contact Phone</label>
              <input type="text" name="receptionistPhone" value={formData.receptionistPhone} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. +91 9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact Email</label>
              <input type="email" name="alternateEmail" value={formData.alternateEmail} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. info@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact Phone</label>
              <input type="text" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. +91 9876543210" />
            </div>
          </div>
        </SectionWrapper>

        {/* Section 5: Application Preferences */}
        <SectionWrapper title="Application Preferences" icon={FaFileAlt}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume Format Preference</label>
                <select name="resumeFormatPreference" value={formData.resumeFormatPreference} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50">
                  <option value="Any">Any Format</option>
                  <option value="PDF only">PDF only (Recommended)</option>
                  <option value="DOC only">DOC only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Instructions for Students</label>
                <textarea name="defaultSpecialInstructions" value={formData.defaultSpecialInstructions} onChange={handleChange} rows="4" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50" placeholder="e.g. Please name your resume as Firstname_Lastname.pdf"></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Standard Additional Documents Needed</label>
              <div className="space-y-3 p-4 bg-slate-50 rounded border border-slate-200">
                {MOCK_DOCS.map(doc => (
                  <label key={doc} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.standardRequiredDocuments?.includes(doc)} onChange={() => handleArrayToggle('standardRequiredDocuments', doc)} className="w-5 h-5 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
                    <span className="text-sm font-bold text-slate-700">{doc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>

      </div>
    </div>
  );
};

export default CompanyProfile;
