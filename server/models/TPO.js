const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const tpoSchema = new mongoose.Schema({
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
  instituteName: {
    type: String,
    required: [true, 'Institute Name is required'],
    trim: true
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
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending'
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
    default: 'tpo',
    enum: ['tpo']
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // TPO specific fields
  designation: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
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
  // Placement related fields
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
}, {
  timestamps: true
});

// Hash password before saving
tpoSchema.pre('save', async function(next) {
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
tpoSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
tpoSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Method to generate password reset token
tpoSchema.methods.generatePasswordResetToken = function() {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetToken = {
    token: token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  };
  return token;
};

// Method to check if OTP is expired
tpoSchema.methods.isOTPExpired = function() {
  return this.emailVerificationOTP && this.emailVerificationOTP.expiresAt < new Date();
};

// Method to check if password reset token is expired
tpoSchema.methods.isPasswordResetTokenExpired = function() {
  return this.passwordResetToken && this.passwordResetToken.expiresAt < new Date();
};

// Method to get display name
tpoSchema.methods.getDisplayName = function() {
  return this.name || 'TPO';
};

// Method to get role data
tpoSchema.methods.getRoleData = function() {
  return {
    name: this.name,
    instituteName: this.instituteName,
    contactNumber: this.contactNumber,
    designation: this.designation,
    department: this.department,
    instituteType: this.instituteType,
    address: this.address,
    totalStudents: this.totalStudents,
    placedStudents: this.placedStudents,
    averagePackage: this.averagePackage,
    highestPackage: this.highestPackage
  };
};

// Remove sensitive fields when converting to JSON
tpoSchema.methods.toJSON = function() {
  const tpo = this.toObject();
  delete tpo.password;
  delete tpo.emailVerificationOTP;
  delete tpo.passwordResetToken;
  return tpo;
};

module.exports = mongoose.model('TPO', tpoSchema);


