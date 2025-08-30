import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  FaFileAlt, 
  FaDownload, 
  FaEye,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaStar,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaCheck
} from 'react-icons/fa';
import { usePDF } from 'react-to-pdf';
import { studentApi } from '../../../services/studentApi';
import { toast } from 'react-hot-toast';

// Memoized Input Component
const MemoizedInput = React.memo(({ 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  className, 
  rows 
}) => {
  if (type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={className}
        placeholder={placeholder}
      />
    );
  }
  
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    />
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
      {
        degree: '',
        institution: '',
        year: '',
        gpa: '',
        achievements: ''
      }
    ],
    experience: [
      {
        title: '',
        company: '',
        duration: '',
        description: ''
      }
    ],
    skills: '',
    projects: [
      {
        name: '',
        description: '',
        technologies: '',
        link: ''
      }
    ],
    certifications: [
      {
        name: '',
        issuer: '',
        year: ''
      }
    ]
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: `${formData.personalInfo.fullName || 'resume'}.pdf` });

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getProfile();
      
      if (response.success && response.data) {
        const profileData = response.data;
        console.log('Profile data received:', profileData);
        
        // Map profile data to form data
        setFormData({
          personalInfo: {
            fullName: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            address: profileData.address || '',
            linkedin: profileData.linkedin || '',
            summary: profileData.summary || ''
          },
          education: profileData.education || [{
            degree: '',
            institution: '',
            year: '',
            gpa: '',
            achievements: ''
          }],
          experience: profileData.experience || [{
            title: '',
            company: '',
            duration: '',
            description: ''
          }],
          skills: (() => {
            if (!profileData.skills) return '';
            
            // Handle the skills object structure from the database
            if (profileData.skills.technicalSkills && profileData.skills.softSkills) {
              const technicalSkills = Array.isArray(profileData.skills.technicalSkills) ? profileData.skills.technicalSkills : [];
              const softSkills = Array.isArray(profileData.skills.softSkills) ? profileData.skills.softSkills : [];
              return [...technicalSkills, ...softSkills].join(', ');
            }
            
            // Handle simple array
            if (Array.isArray(profileData.skills)) {
              return profileData.skills.join(', ');
            }
            
            // Handle string
            if (typeof profileData.skills === 'string') {
              return profileData.skills;
            }
            
            return '';
          })(),
          projects: profileData.projects || [{
            name: '',
            description: '',
            technologies: '',
            link: ''
          }],
          certifications: profileData.certifications || [{
            name: '',
            issuer: '',
            year: ''
          }]
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async () => {
    try {
      setSaving(true);
      
      // Convert form data to profile format
      const profileData = {
        name: formData.personalInfo.fullName,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone,
        address: formData.personalInfo.address,
        linkedin: formData.personalInfo.linkedin,
        summary: formData.personalInfo.summary,
        education: formData.education,
        experience: formData.experience,
        skills: (() => {
          if (!formData.skills) return { technicalSkills: [], softSkills: [] };
          
          const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
          
          // For now, we'll put all skills in technicalSkills
          // In a more sophisticated implementation, you might want to categorize them
          return {
            technicalSkills: skillsArray,
            softSkills: []
          };
        })(),
        projects: formData.projects,
        certifications: formData.certifications
      };

      await studentApi.updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile data:', error);
      toast.error('Failed to save profile data');
    } finally {
      setSaving(false);
    }
  };

  const steps = useMemo(() => [
    { id: 0, title: 'Personal Info', icon: FaUser, completed: false },
    { id: 1, title: 'Education', icon: FaGraduationCap, completed: false },
    { id: 2, title: 'Experience', icon: FaBriefcase, completed: false },
    { id: 3, title: 'Skills', icon: FaStar, completed: false },
    { id: 4, title: 'Projects', icon: FaFileAlt, completed: false },
    { id: 5, title: 'Certifications', icon: FaStar, completed: false }
  ], []);

  // Optimized input change handler
  const handleInputChange = useCallback((section, field, value, index = null) => {
    setFormData(prev => {
      if (index !== null) {
        // For array items
        const currentSection = Array.isArray(prev[section]) ? prev[section] : [];
        const newSection = [...currentSection];
        newSection[index] = { ...newSection[index], [field]: value };
        return { ...prev, [section]: newSection };
      } else {
        // For direct properties
        if (section === 'skills') {
          return { ...prev, skills: value };
        } else {
          return { ...prev, [section]: { ...prev[section], [field]: value } };
        }
      }
    });
  }, []);

  const addItem = useCallback((section) => {
    setFormData(prev => {
      const emptyItem = getEmptyItem(section);
      const currentSection = Array.isArray(prev[section]) ? prev[section] : [];
      return {
        ...prev,
        [section]: [...currentSection, emptyItem]
      };
    });
  }, []);

  const removeItem = useCallback((section, index) => {
    setFormData(prev => {
      const currentSection = Array.isArray(prev[section]) ? prev[section] : [];
      return {
        ...prev,
        [section]: currentSection.filter((_, i) => i !== index)
      };
    });
  }, []);

  const getEmptyItem = useCallback((section) => {
    switch (section) {
      case 'education':
        return { degree: '', institution: '', year: '', gpa: '', achievements: '' };
      case 'experience':
        return { title: '', company: '', duration: '', description: '' };
      case 'projects':
        return { name: '', description: '', technologies: '', link: '' };
      case 'certifications':
        return { name: '', issuer: '', year: '' };
      default:
        return {};
    }
  }, []);

  const handleDownloadPDF = useCallback(() => {
    toPDF();
  }, [toPDF]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const isStepCompleted = useCallback((stepIndex) => {
    switch (stepIndex) {
      case 0: // Personal Info
        return formData.personalInfo.fullName && formData.personalInfo.email;
      case 1: // Education
        return Array.isArray(formData.education) && formData.education.some(edu => edu.degree && edu.institution);
      case 2: // Experience
        return Array.isArray(formData.experience) && formData.experience.some(exp => exp.title && exp.company);
      case 3: // Skills
        return formData.skills.trim().length > 0;
      case 4: // Projects
        return Array.isArray(formData.projects) && formData.projects.some(project => project.name);
      case 5: // Certifications
        return Array.isArray(formData.certifications) && formData.certifications.some(cert => cert.name);
      default:
        return false;
    }
  }, [formData]);

  // Memoized Step Components
  const StepIndicator = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = isStepCompleted(index);
          const isActive = currentStep === index;
          
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                    : isCompleted 
                    ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                    : 'bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  isCompleted ? 'bg-green-300' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  ), [steps, currentStep, isStepCompleted, goToStep]);

  const PersonalInfoStep = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <FaUser className="w-5 h-5" />
        Personal Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <MemoizedInput
            value={formData.personalInfo.fullName}
            onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <MemoizedInput
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <MemoizedInput
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
          <MemoizedInput
            type="url"
            value={formData.personalInfo.linkedin}
            onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your LinkedIn URL"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <MemoizedInput
            value={formData.personalInfo.address}
            onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your address"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
          <MemoizedInput
            type="textarea"
            value={formData.personalInfo.summary}
            onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write a brief professional summary"
          />
        </div>
      </div>
    </div>
  ), [formData.personalInfo, handleInputChange]);

  const EducationStep = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaGraduationCap className="w-5 h-5" />
          Education
        </h3>
        <button
          onClick={() => addItem('education')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <FaPlus className="w-3 h-3" />
          Add Education
        </button>
      </div>
      
             {Array.isArray(formData.education) && formData.education.map((edu, index) => (
        <div key={`education-${index}`} className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium text-gray-700">Education #{index + 1}</h5>
                         {Array.isArray(formData.education) && formData.education.length > 1 && (
              <button
                onClick={() => removeItem('education', index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <MemoizedInput
                value={edu.degree}
                onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Bachelor of Science in Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
              <MemoizedInput
                value={edu.institution}
                onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University/College name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <MemoizedInput
                value={edu.year}
                onChange={(e) => handleInputChange('education', 'year', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2020-2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
              <MemoizedInput
                value={edu.gpa}
                onChange={(e) => handleInputChange('education', 'gpa', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 3.8/4.0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
              <MemoizedInput
                type="textarea"
                value={edu.achievements}
                onChange={(e) => handleInputChange('education', 'achievements', e.target.value, index)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Academic achievements, honors, etc."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [formData.education, handleInputChange, addItem, removeItem]);

  const ExperienceStep = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaBriefcase className="w-5 h-5" />
          Work Experience
        </h3>
        <button
          onClick={() => addItem('experience')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <FaPlus className="w-3 h-3" />
          Add Experience
        </button>
      </div>
      
             {Array.isArray(formData.experience) && formData.experience.map((exp, index) => (
        <div key={`experience-${index}`} className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium text-gray-700">Experience #{index + 1}</h5>
                         {Array.isArray(formData.experience) && formData.experience.length > 1 && (
              <button
                onClick={() => removeItem('experience', index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <MemoizedInput
                value={exp.title}
                onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
              <MemoizedInput
                value={exp.company}
                onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <MemoizedInput
                value={exp.duration}
                onChange={(e) => handleInputChange('experience', 'duration', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Jan 2023 - Present"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <MemoizedInput
                type="textarea"
                value={exp.description}
                onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your responsibilities and achievements"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [formData.experience, handleInputChange, addItem, removeItem]);

  const SkillsStep = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <FaStar className="w-5 h-5" />
        Skills
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills *</label>
        <MemoizedInput
          type="textarea"
          value={formData.skills}
          onChange={(e) => handleInputChange('skills', '', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="List your technical and soft skills (e.g., JavaScript, React, Python, Leadership, Communication)"
        />
        <p className="text-sm text-gray-500 mt-2">
          Separate skills with commas or list them on separate lines
        </p>
      </div>
    </div>
  ), [formData.skills, handleInputChange]);

  const ProjectsStep = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaFileAlt className="w-5 h-5" />
          Projects
        </h3>
        <button
          onClick={() => addItem('projects')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <FaPlus className="w-3 h-3" />
          Add Project
        </button>
      </div>
      
             {Array.isArray(formData.projects) && formData.projects.map((project, index) => (
        <div key={`project-${index}`} className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium text-gray-700">Project #{index + 1}</h5>
                         {Array.isArray(formData.projects) && formData.projects.length > 1 && (
              <button
                onClick={() => removeItem('projects', index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
              <MemoizedInput
                value={project.name}
                onChange={(e) => handleInputChange('projects', 'name', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
              <MemoizedInput
                value={project.technologies}
                onChange={(e) => handleInputChange('projects', 'technologies', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <MemoizedInput
                type="textarea"
                value={project.description}
                onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the project and your role"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
              <MemoizedInput
                type="url"
                value={project.link}
                onChange={(e) => handleInputChange('projects', 'link', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="GitHub, live demo, or portfolio link"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [formData.projects, handleInputChange, addItem, removeItem]);

  const CertificationsStep = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaStar className="w-5 h-5" />
          Certifications
        </h3>
        <button
          onClick={() => addItem('certifications')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <FaPlus className="w-3 h-3" />
          Add Certification
        </button>
      </div>
      
             {Array.isArray(formData.certifications) && formData.certifications.map((cert, index) => (
        <div key={`certification-${index}`} className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium text-gray-700">Certification #{index + 1}</h5>
                         {Array.isArray(formData.certifications) && formData.certifications.length > 1 && (
              <button
                onClick={() => removeItem('certifications', index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name *</label>
              <MemoizedInput
                value={cert.name}
                onChange={(e) => handleInputChange('certifications', 'name', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., AWS Certified Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
              <MemoizedInput
                value={cert.issuer}
                onChange={(e) => handleInputChange('certifications', 'issuer', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Amazon Web Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <MemoizedInput
                value={cert.year}
                onChange={(e) => handleInputChange('certifications', 'year', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2023"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [formData.certifications, handleInputChange, addItem, removeItem]);

  const renderCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 0:
        return PersonalInfoStep;
      case 1:
        return EducationStep;
      case 2:
        return ExperienceStep;
      case 3:
        return SkillsStep;
      case 4:
        return ProjectsStep;
      case 5:
        return CertificationsStep;
      default:
        return PersonalInfoStep;
    }
  }, [currentStep, PersonalInfoStep, EducationStep, ExperienceStep, SkillsStep, ProjectsStep, CertificationsStep]);

  const ResumePreview = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Resume Preview</h3>
        <button
          onClick={() => setShowPreview(false)}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Form
        </button>
      </div>
      
      <div ref={targetRef} className="bg-white border border-gray-300 p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {formData.personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-sm">
            {formData.personalInfo.email && (
              <div className="flex items-center gap-1">
                <FaEnvelope className="w-3 h-3" />
                {formData.personalInfo.email}
              </div>
            )}
            {formData.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <FaPhone className="w-3 h-3" />
                {formData.personalInfo.phone}
              </div>
            )}
            {formData.personalInfo.address && (
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="w-3 h-3" />
                {formData.personalInfo.address}
              </div>
            )}
            {formData.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <span>LinkedIn:</span>
                <a href={formData.personalInfo.linkedin} className="text-blue-600 hover:underline">
                  {formData.personalInfo.linkedin.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {formData.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b-2 border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{formData.personalInfo.summary}</p>
          </div>
        )}

                 {/* Education */}
         {Array.isArray(formData.education) && formData.education.some(edu => edu.degree || edu.institution) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">
              Education
            </h2>
            {Array.isArray(formData.education) && formData.education.map((edu, index) => (
              (edu.degree || edu.institution) && (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.achievements && (
                        <p className="text-gray-700 text-sm mt-1">{edu.achievements}</p>
                      )}
                    </div>
                    <div className="text-right text-gray-600">
                      <p>{edu.year}</p>
                      {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

                 {/* Experience */}
         {Array.isArray(formData.experience) && formData.experience.some(exp => exp.title || exp.company) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">
              Work Experience
            </h2>
            {Array.isArray(formData.experience) && formData.experience.map((exp, index) => (
              (exp.title || exp.company) && (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                    <span className="text-gray-600 text-sm">{exp.duration}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Skills */}
        {formData.skills && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">
              Skills
            </h2>
            <p className="text-gray-700 leading-relaxed">{formData.skills}</p>
          </div>
        )}

                 {/* Projects */}
         {Array.isArray(formData.projects) && formData.projects.some(project => project.name) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">
              Projects
            </h2>
            {Array.isArray(formData.projects) && formData.projects.map((project, index) => (
              project.name && (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} className="text-blue-600 hover:underline text-sm">
                        View Project
                      </a>
                    )}
                  </div>
                  {project.technologies && (
                    <p className="text-gray-600 text-sm mb-2">Technologies: {project.technologies}</p>
                  )}
                  {project.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                  )}
                </div>
              )
            ))}
          </div>
        )}

                 {/* Certifications */}
         {Array.isArray(formData.certifications) && formData.certifications.some(cert => cert.name) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1">
              Certifications
            </h2>
            {Array.isArray(formData.certifications) && formData.certifications.map((cert, index) => (
              cert.name && (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                      <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    </div>
                    <span className="text-gray-600 text-sm">{cert.year}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
        >
          <FaDownload className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  ), [formData, targetRef, handleDownloadPDF]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Resume Builder</h2>
          <p className="text-gray-600">Create your professional resume step by step</p>
        </div>
        <button
          onClick={saveProfileData}
          disabled={saving}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <FaCheck className="w-4 h-4" />
              Save Profile
            </>
          )}
        </button>
      </div>

      {showPreview ? (
        ResumePreview
      ) : (
        <>
          {StepIndicator}
          
          {renderCurrentStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <FaChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            {currentStep === steps.length - 1 ? (
              // Show Preview and Download buttons only on the last step
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FaEye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <FaDownload className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            ) : (
              // Show Next button for all other steps
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
                <FaChevronRight className="w-4 h-4" />
              </button>
            )}
            
            {/* Empty div to maintain flex layout when on last step */}
            {currentStep === steps.length - 1 && <div></div>}
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeBuilder;
