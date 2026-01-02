const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const superAdminSchema = new mongoose.Schema({
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
  role: {
    type: String,
    default: 'superadmin',
    enum: ['superadmin']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  permissions: {
    canManageUsers: {
      type: Boolean,
      default: true
    },
    canManageTPOs: {
      type: Boolean,
      default: true
    },
    canManageCompanies: {
      type: Boolean,
      default: true
    },
    canManageStudents: {
      type: Boolean,
      default: true
    },
    canManageSystem: {
      type: Boolean,
      default: true
    }
  },
  // System management fields
  systemSettings: {
    allowStudentRegistration: {
      type: Boolean,
      default: true
    },
    allowCompanyRegistration: {
      type: Boolean,
      default: true
    },
    allowTPORegistration: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: true
    },
    requireAdminApproval: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
superAdminSchema.pre('save', async function(next) {
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
superAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get display name
superAdminSchema.methods.getDisplayName = function() {
  return this.name || 'Super Admin';
};

// Remove sensitive fields when converting to JSON
superAdminSchema.methods.toJSON = function() {
  const superAdmin = this.toObject();
  delete superAdmin.password;
  return superAdmin;
};

module.exports = mongoose.model('SuperAdmin', superAdminSchema);

