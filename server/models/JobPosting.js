const mongoose = require('mongoose');

// Counter schema for auto-generating Job IDs
const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const selectionRoundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  roundName: { type: String, required: true, trim: true },
  roundType: {
    type: String,
    enum: ['aptitude_test', 'technical_test', 'coding_round', 'group_discussion', 'technical_interview', 'hr_interview', 'case_study', 'assignment', 'other'],
    required: true
  },
  duration: { type: String, trim: true },
  mode: { type: String, enum: ['online', 'offline'], required: true },
  platform: { type: String, trim: true },
  topics: { type: String, trim: true }
}, { _id: false });

const jobPostingSchema = new mongoose.Schema({
  // ===== AUTO-GENERATED =====
  jobId: {
    type: String,
    unique: true,
    index: true
  },

  // ===== STEP 1: COMPANY & JOB BASICS =====
  companyName: { type: String, required: true, trim: true },
  companyWebsite: { type: String, trim: true },
  companyLogo: { type: String, trim: true }, // URL/base64
  industry: {
    type: String,
    enum: ['IT/Software', 'Finance/Banking', 'Manufacturing', 'Consulting', 'E-commerce', 'Healthcare', 'Education', 'Automobile', 'FMCG', 'Telecom', 'Media', 'Other'],
    required: true
  },
  companySize: {
    type: String,
    enum: ['startup', 'small', 'medium', 'large'],
    required: true
  },
  companyDescription: { type: String, required: true, maxlength: 500 },
  companyLocation: { type: String, required: true, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  department: {
    type: String,
    enum: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product', 'Design', 'Other'],
    required: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'internship', 'part-time', 'contract'],
    required: true
  },
  jobCategory: {
    type: String,
    enum: ['technical', 'non-technical', 'management'],
    required: true
  },

  // ===== STEP 2: DRIVE TYPE & ELIGIBILITY =====
  driveType: {
    type: String,
    enum: ['on_campus', 'off_campus'],
    required: true
  },
  targetBatches: {
    type: [String],
    validate: {
      validator: function(v) { return v && v.length > 0; },
      message: 'At least one target batch is required'
    }
  },
  eligibleDegrees: {
    type: [String],
    validate: {
      validator: function(v) { return v && v.length > 0; },
      message: 'At least one eligible degree is required'
    }
  },
  eligibleBranches: {
    type: [String],
    validate: {
      validator: function(v) { return v && v.length > 0; },
      message: 'At least one eligible branch is required'
    }
  },
  // Eligibility Criteria
  eligibilityCriteria: {
    minCgpaPercentage: {
      type: { type: String, enum: ['cgpa', 'percentage'], default: 'cgpa' },
      value: { type: Number, min: 0 }
    },
    backlogsAllowed: { type: Boolean, default: false },
    maxActiveBacklogs: { type: Number, min: 0, default: 0 },
    min10thPercentage: { type: Number, min: 0, max: 100 },
    min12thPercentage: { type: Number, min: 0, max: 100 },
    gapYearsAllowed: { type: Boolean, default: false },
    maxGapYears: { type: Number, min: 0, default: 0 },
    minAge: { type: Number, min: 15, max: 100 },
    maxAge: { type: Number, min: 15, max: 100 },
    otherCriteria: { type: String, trim: true }
  },

  // ===== STEP 3: SELECTION PROCESS =====
  totalRounds: { type: Number, min: 1, max: 10 },
  selectionRounds: [selectionRoundSchema],

  // ===== STEP 4: COMPENSATION & JOB DETAILS =====
  // Compensation
  ctc: { type: Number, min: 0 },
  baseSalary: { type: Number, min: 0 },
  stipend: { type: Number, min: 0 },
  joiningBonus: { type: Number, min: 0 },
  performanceBonus: { type: String, trim: true },
  otherBenefits: { type: String, trim: true },

  // Job Details
  jobDescription: { type: String, required: true, minlength: 100 },
  requiredSkills: {
    type: [String],
    validate: {
      validator: function(v) { return v && v.length > 0; },
      message: 'At least one required skill is needed'
    }
  },
  preferredSkills: [String],
  experienceRequired: {
    type: String,
    enum: ['0', '0-1', '1-2', '2-3', 'other'],
    default: '0'
  },
  numberOfOpenings: { type: Number, required: true, min: 1 },
  workMode: {
    type: String,
    enum: ['office', 'hybrid', 'remote'],
    required: true
  },
  workLocations: {
    type: [String],
    validate: {
      validator: function(v) { return v && v.length > 0; },
      message: 'At least one work location is required'
    }
  },

  // Internship-specific
  internshipDuration: { type: String, trim: true },
  ppoPossibility: { type: String, enum: ['yes', 'no', 'performance_based'] },

  // Bond/Agreement
  bondRequired: { type: Boolean, default: false },
  bondDuration: { type: String, trim: true },
  bondAmount: { type: Number, min: 0 },
  bondDetails: { type: String, trim: true },

  // ===== STEP 5: DATES & APPLICATION REQUIREMENTS =====
  applicationDeadline: { type: Date, required: true },
  tentativeDriveDate: { type: Date },
  expectedJoiningDate: { type: Date, required: true },
  resultDeclarationDate: { type: Date },

  // On-Campus specific
  preferredDriveDateRange: {
    start: Date,
    end: Date
  },
  venueRequirements: { type: String, trim: true },
  expectedStudents: { type: Number, min: 0 },
  pptRequired: { type: Boolean, default: false },
  pptDetails: {
    dateTime: Date,
    duration: { type: String, trim: true },
    venue: { type: String, trim: true }
  },

  // Off-Campus specific
  applicationPortalUrl: { type: String, trim: true },
  howToApply: { type: String, trim: true },

  // Application Requirements
  resumeRequired: { type: Boolean, default: true },
  resumeFormat: { type: String, enum: ['any', 'pdf', 'doc'], default: 'any' },
  coverLetterRequired: { type: Boolean, default: false },
  additionalDocuments: [String],
  specialInstructions: { type: String, trim: true },

  // Contact Information
  hrName: { type: String, required: true, trim: true },
  contactEmail: { type: String, required: true, trim: true },
  contactPhone: { type: String, required: true, trim: true },
  alternateEmail: { type: String, trim: true },
  alternatePhone: { type: String, trim: true },

  // ===== STATUS & METADATA =====
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'rejected', 'changes_requested', 'active', 'closed'],
    default: 'draft'
  },
  rejectionReason: { type: String, trim: true },
  tpoComments: { type: String, trim: true },

  // Relationships
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TPO'
  },
  approvedAt: { type: Date },

  // Analytics
  views: { type: Number, default: 0 },
  applicationCount: { type: Number, default: 0 },
  clickThroughs: { type: Number, default: 0 },

  // Legacy compatibility
  title: { type: String, trim: true }, // maps to jobTitle
  description: { type: String, trim: true }, // maps to jobDescription
  requirements: [String],
  location: { type: String, trim: true },
  salary: { type: String, trim: true },
  type: {
    type: String,
    enum: ['full-time', 'internship', 'contract', 'part-time']
  },
  category: { type: String },
  skills: [String],
  isActive: { type: Boolean, default: true },
  package: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  experience: {
    min: Number,
    max: Number
  },
  deadline: Date,
  postedAt: { type: Date, default: Date.now },
  targetColleges: [{ type: String, trim: true }]
}, {
  timestamps: true
});

// Auto-generate Job ID before saving
jobPostingSchema.pre('save', async function(next) {
  if (this.isNew && !this.jobId) {
    try {
      const year = new Date().getFullYear();
      const counter = await Counter.findByIdAndUpdate(
        'jobPostingId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const paddedSeq = String(counter.seq).padStart(4, '0');
      this.jobId = `JOB-${year}-${paddedSeq}`;
    } catch (err) {
      // Fallback to timestamp-based ID
      this.jobId = `JOB-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    }
  }

  // Sync legacy fields
  if (this.jobTitle && !this.title) this.title = this.jobTitle;
  if (this.jobDescription && !this.description) this.description = this.jobDescription;
  if (this.employmentType && !this.type) this.type = this.employmentType;
  if (this.applicationDeadline && !this.deadline) this.deadline = this.applicationDeadline;

  next();
});

// Indexes
jobPostingSchema.index({ company: 1, status: 1 });
jobPostingSchema.index({ driveType: 1, status: 1 });
jobPostingSchema.index({ status: 1, applicationDeadline: 1 });
jobPostingSchema.index({ targetBatches: 1, eligibleDegrees: 1, eligibleBranches: 1 });
jobPostingSchema.index({ isActive: 1, category: 1 });
jobPostingSchema.index({ type: 1, isActive: 1 });
jobPostingSchema.index({ targetColleges: 1, isActive: 1 });
jobPostingSchema.index({ createdBy: 1, isActive: 1 });
jobPostingSchema.index({ postedAt: -1 });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
