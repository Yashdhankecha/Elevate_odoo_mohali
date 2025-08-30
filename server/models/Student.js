const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
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
  rollNumber: {
    type: String,
    required: [true, 'Roll Number is required'],
    unique: true,
    trim: true
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true
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
  // Placement related fields
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
  resume: {
    type: String,
    default: ''
  },
  skills: [String],
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
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
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
studentSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Method to generate password reset token
studentSchema.methods.generatePasswordResetToken = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = {
    token: token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  };
  return token;
};

// Method to check if OTP is expired
studentSchema.methods.isOTPExpired = function() {
  return this.emailVerificationOTP && this.emailVerificationOTP.expiresAt < new Date();
};

// Method to check if password reset token is expired
studentSchema.methods.isPasswordResetTokenExpired = function() {
  return this.passwordResetToken && this.passwordResetToken.expiresAt < new Date();
};

// Remove sensitive fields when converting to JSON
studentSchema.methods.toJSON = function() {
  const student = this.toObject();
  delete student.password;
  delete student.emailVerificationOTP;
  delete student.passwordResetToken;
  return student;
};

module.exports = mongoose.model('Student', studentSchema);

