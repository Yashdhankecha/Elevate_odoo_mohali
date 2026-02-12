const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },

  // Academic Information
  rollNumber: {
    type: String,
    required: [true, 'Roll Number is required'],
    unique: true,
    trim: true
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true,
    enum: ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'AI&DS', 'Other']
  },
  graduationYear: {
    type: Number,
    required: [true, 'Graduation Year is required'],
    min: [new Date().getFullYear(), 'Graduation year cannot be in the past'],
    max: [new Date().getFullYear() + 10, 'Graduation year cannot be more than 10 years in the future']
  },
  collegeName: {
    type: String,
    required: [true, 'College Name is required'],
    trim: true
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
    default: 6
  },

  // Academic Performance
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  sgpa: [{
    semester: Number,
    gpa: Number
  }],
  backlogHistory: {
    type: Number,
    default: 0,
    min: 0
  },
  currentBacklogs: {
    type: Number,
    default: 0,
    min: 0
  },

  // Personal Information
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    },
    zipCode: String
  },

  // Skills and Certifications
  skills: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    certificateUrl: String
  }],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Basic', 'Conversational', 'Fluent', 'Native']
    }
  }],

  // Resume and Portfolio
  resume: {
    type: String,
    default: ''
  },
  portfolioUrl: String,
  githubUrl: String,
  linkedinUrl: String,

  // Placement Information
  isPlaced: {
    type: Boolean,
    default: false
  },
  placementDetails: {
    company: String,
    package: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      },
      type: {
        type: String,
        enum: ['CTC', 'In-Hand', 'Gross']
      }
    },
    role: String,
    location: String,
    placementDate: Date,
    offerLetterUrl: String
  },

  // Application Tracking
  applications: [{
    jobId: String,
    companyName: String,
    position: String,
    appliedDate: Date,
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Rejected', 'Withdrawn']
    },
    interviewRounds: [{
      round: Number,
      date: Date,
      type: {
        type: String,
        enum: ['Online', 'Offline', 'Phone', 'Video Call']
      },
      status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled']
      },
      feedback: String,
      score: Number
    }],
    notes: String
  }],

  // Internship Experience
  internships: [{
    company: String,
    role: String,
    duration: {
      startDate: Date,
      endDate: Date
    },
    stipend: Number,
    description: String,
    certificateUrl: String
  }],

  // Projects
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    githubUrl: String,
    liveUrl: String,
    duration: {
      startDate: Date,
      endDate: Date
    }
  }],

  // Achievements and Activities
  achievements: [{
    title: String,
    description: String,
    date: Date,
    certificateUrl: String
  }],
  extracurricularActivities: [String],

  // Preferences
  preferredLocations: [String],
  preferredCompanies: [String],
  expectedPackage: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid', 'Any']
  },

  // System Fields
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    code: String,
    expiresAt: Date
  },
  passwordResetToken: {
    token: String,
    expiresAt: Date
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student']
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileCompletion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Verification fields for TPO
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: {
    type: String,
    trim: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
studentSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Method to generate password reset token
studentSchema.methods.generatePasswordResetToken = function () {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = {
    token: token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  };
  return token;
};

// Method to check if OTP is expired
studentSchema.methods.isOTPExpired = function () {
  return this.emailVerificationOTP && this.emailVerificationOTP.expiresAt < new Date();
};

// Method to check if password reset token is expired
studentSchema.methods.isPasswordResetTokenExpired = function () {
  return this.passwordResetToken && this.passwordResetToken.expiresAt < new Date();
};

// Method to calculate profile completion percentage
studentSchema.methods.calculateProfileCompletion = function () {
  let completed = 0;
  let total = 0;

  // Basic info (25%)
  if (this.name) completed += 1;
  if (this.email) completed += 1;
  if (this.phoneNumber) completed += 1;
  if (this.address?.city) completed += 1;
  total += 4;

  // Academic info (25%)
  if (this.rollNumber) completed += 1;
  if (this.branch) completed += 1;
  if (this.graduationYear) completed += 1;
  if (this.collegeName) completed += 1;
  total += 4;

  // Skills and resume (25%)
  if (this.skills && this.skills.length > 0) completed += 1;
  if (this.resume) completed += 1;
  if (this.projects && this.projects.length > 0) completed += 1;
  if (this.certifications && this.certifications.length > 0) completed += 1;
  total += 4;

  // Preferences (25%)
  if (this.preferredLocations && this.preferredLocations.length > 0) completed += 1;
  if (this.expectedPackage?.min) completed += 1;
  if (this.workMode) completed += 1;
  if (this.profilePicture) completed += 1;
  total += 4;

  this.profileCompletion = Math.round((completed / total) * 100);
  return this.profileCompletion;
};

// Method to get display name
studentSchema.methods.getDisplayName = function () {
  return this.name || 'Student';
};

// Method to get role data
studentSchema.methods.getRoleData = function () {
  return {
    name: this.name,
    rollNumber: this.rollNumber,
    branch: this.branch,
    graduationYear: this.graduationYear,
    collegeName: this.collegeName,
    cgpa: this.cgpa,
    skills: this.skills,
    resume: this.resume,
    isPlaced: this.isPlaced,
    profileCompletion: this.profileCompletion
  };
};

// Remove sensitive fields when converting to JSON
studentSchema.methods.toJSON = function () {
  const student = this.toObject();
  delete student.password;
  delete student.emailVerificationOTP;
  delete student.passwordResetToken;
  return student;
};

module.exports = mongoose.model('Student', studentSchema);
