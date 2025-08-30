const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Common fields for all roles
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
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['student', 'company', 'tpo', 'admin', 'superadmin']
  },
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
  // Common profile fields for all roles
  name: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },

  // Student specific fields
  student: {
    name: String,
    rollNumber: String,
    branch: String,
    graduationYear: Number,
    collegeName: String,
    isPlaced: {
      type: Boolean,
      default: false
    },
    placementDetails: {
      company: String,
      package: String,
      role: String,
      placementDate: Date
    },
    resume: String,
    skills: [String],
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    // Extended fields for dynamic features
    profileCompletion: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    totalPracticeSessions: {
      type: Number,
      default: 0
    },
    averageTestScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    interviewsScheduled: {
      type: Number,
      default: 0
    },
    offersReceived: {
      type: Number,
      default: 0
    },
    personalInfo: {
      phone: String,
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
      },
      linkedin: String,
      github: String,
      portfolio: String
    },
    education: {
      degree: String,
      specialization: String,
      currentSemester: Number,
      totalSemesters: Number
    },
    projects: [{
      title: String,
      description: String,
      technologies: [String],
      githubLink: String,
      liveLink: String,
      duration: String,
      role: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      credentialId: String,
      link: String
    }],
    achievements: [{
      title: String,
      description: String,
      date: Date,
      category: String
    }],
    preferences: {
      preferredLocations: [String],
      preferredRoles: [String],
      expectedSalary: {
        min: Number,
        max: Number
      },
      workType: {
        type: String,
        enum: ['full-time', 'internship', 'part-time', 'contract'],
        default: 'full-time'
      }
    }
  },

  // Company specific fields
  company: {
    companyName: String,
    contactNumber: String,
    industry: String,
    companySize: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    },
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    description: String,
    jobPostings: [{
      title: String,
      description: String,
      requirements: [String],
      package: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'INR'
        }
      },
      location: String,
      type: {
        type: String,
        enum: ['full-time', 'internship', 'contract']
      },
      isActive: {
        type: Boolean,
        default: true
      },
      postedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // TPO specific fields
  tpo: {
    name: String,
    instituteName: String,
    contactNumber: String,
    designation: String,
    department: String,
    instituteType: {
      type: String,
      enum: ['university', 'college', 'institute', 'school']
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    totalStudents: {
      type: Number,
      default: 0
    },
    placedStudents: {
      type: Number,
      default: 0
    },
    averagePackage: {
      type: Number,
      default: 0
    },
    highestPackage: {
      type: Number,
      default: 0
    },
    placementStats: [{
      year: Number,
      totalStudents: Number,
      placedStudents: Number,
      averagePackage: Number,
      highestPackage: Number
    }]
  },

  // Admin specific fields
  admin: {
    name: String,
    contactNumber: String,
    department: String,
    permissions: [{
      type: String,
      enum: ['user_management', 'company_approval', 'reports', 'settings']
    }],
    assignedInstitutions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution'
    }]
  },

  // Superadmin specific fields
  superadmin: {
    name: String,
    contactNumber: String,
    systemAccess: {
      type: Boolean,
      default: true
    },
    permissions: [{
      type: String,
      enum: ['admin_approval', 'company_approval', 'institution_management', 'system_settings']
    }]
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = {
    token: token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  };
  return token;
};

// Method to check if OTP is expired
userSchema.methods.isOTPExpired = function() {
  return this.emailVerificationOTP && this.emailVerificationOTP.expiresAt < new Date();
};

// Method to check if password reset token is expired
userSchema.methods.isPasswordResetTokenExpired = function() {
  return this.passwordResetToken && this.passwordResetToken.expiresAt < new Date();
};

// Method to get display name based on role
userSchema.methods.getDisplayName = function() {
  switch (this.role) {
    case 'student':
      return this.student?.name || 'Student';
    case 'company':
      return this.company?.companyName || 'Company';
    case 'tpo':
      return this.tpo?.name || 'TPO';
    case 'admin':
      return this.admin?.name || 'Admin';
    case 'superadmin':
      return this.superadmin?.name || 'Super Admin';
    default:
      return 'User';
  }
};

// Method to get role-specific data
userSchema.methods.getRoleData = function() {
  switch (this.role) {
    case 'student':
      return this.student;
    case 'company':
      return this.company;
    case 'tpo':
      return this.tpo;
    case 'admin':
      return this.admin;
    case 'superadmin':
      return this.superadmin;
    default:
      return {};
  }
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationOTP;
  delete user.passwordResetToken;
  return user;
};

module.exports = mongoose.model('User', userSchema);
