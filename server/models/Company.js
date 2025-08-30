const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company Name is required'],
    trim: true,
    minlength: [2, 'Company Name must be at least 2 characters long'],
    maxlength: [100, 'Company Name cannot exceed 100 characters']
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
  contactNumber: {
    type: String,
    required: [true, 'Contact Number is required'],
    trim: true,
    match: [/^[+]?[\d\s\-\(\)]+$/, 'Please enter a valid contact number']
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
  role: {
    type: String,
    default: 'company',
    enum: ['company']
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // Company specific fields
  industry: {
    type: String,
    trim: true
  },
  companySize: {
    type: String,
    enum: ['startup', 'small', 'medium', 'large', 'enterprise']
  },
  website: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  // Placement related fields
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
}, {
  timestamps: true
});

// Hash password before saving
companySchema.pre('save', async function(next) {
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
companySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
companySchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Method to generate password reset token
companySchema.methods.generatePasswordResetToken = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = {
    token: token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  };
  return token;
};

// Method to check if OTP is expired
companySchema.methods.isOTPExpired = function() {
  return this.emailVerificationOTP && this.emailVerificationOTP.expiresAt < new Date();
};

// Method to check if password reset token is expired
companySchema.methods.isPasswordResetTokenExpired = function() {
  return this.passwordResetToken && this.passwordResetToken.expiresAt < new Date();
};

// Remove sensitive fields when converting to JSON
companySchema.methods.toJSON = function() {
  const company = this.toObject();
  delete company.password;
  delete company.emailVerificationOTP;
  delete company.passwordResetToken;
  return company;
};

module.exports = mongoose.model('Company', companySchema);

