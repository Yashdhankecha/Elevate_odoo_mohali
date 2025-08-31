const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    enum: ['student', 'company', 'tpo', 'superadmin']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending'
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
  // Approval system fields
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  // Student-specific data
  student: {
    name: String,
    rollNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    branch: String,
    graduationYear: String,
    collegeName: String,
    // Additional student fields
    personalInfo: {
      dateOfBirth: Date,
      gender: String,
      phoneNumber: String,
      address: String,
      linkedinProfile: String,
      githubProfile: String
    },
    academicInfo: {
      cgpa: Number,
      currentSemester: Number,
      totalSemesters: Number,
      backlogHistory: [String],
      achievements: [String]
    },
    skills: {
      technicalSkills: [String],
      softSkills: [String],
      certifications: [{
        name: String,
        issuer: String,
        dateObtained: Date,
        expiryDate: Date
      }]
    },
    experience: {
      internships: [{
        company: String,
        role: String,
        duration: String,
        description: String,
        technologies: [String]
      }],
      projects: [{
        title: String,
        description: String,
        technologies: [String],
        githubLink: String,
        liveLink: String
      }]
    },
    placementInfo: {
      isPlaced: {
        type: Boolean,
        default: false
      },
      placementCompany: String,
      placementRole: String,
      placementPackage: String,
      placementDate: Date
    },
    resume: String,
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
  // Company-specific data
  company: {
    companyName: {
      type: String,
      required: function() { return this.role === 'company'; }
    },
    contactNumber: String,
    industry: String,
    companySize: String,
    website: String,
    description: String,
    location: String
  },
  // TPO-specific data
  tpo: {
    name: String,
    instituteName: String,
    contactNumber: String,
    designation: String,
    department: String,
    location: String
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

// Method to get display name
userSchema.methods.getDisplayName = function() {
  try {
    switch (this.role) {
      case 'student':
        return this.student?.name || this.name || 'Student';
      case 'company':
        return this.company?.companyName || this.name || 'Company';
      case 'tpo':
        return this.tpo?.name || this.name || 'TPO';
      case 'superadmin':
        return 'Super Admin';
      default:
        return this.name || 'User';
    }
  } catch (error) {
    console.error('Error in getDisplayName:', error);
    return this.name || 'User';
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
    default:
      return null;
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
