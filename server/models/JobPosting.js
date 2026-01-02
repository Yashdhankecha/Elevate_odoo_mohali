const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  responsibilities: [String],
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
    enum: ['full-time', 'internship', 'contract', 'part-time'],
    default: 'full-time'
  },
  category: {
    type: String,
    enum: ['software-engineering', 'data-science', 'product-management', 'design', 'marketing', 'sales', 'other'],
    default: 'software-engineering'
  },
  experience: {
    min: Number,
    max: Number
  },
  skills: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  deadline: Date,
  applicationCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  // College targeting for internships
  targetColleges: [{
    type: String,
    trim: true
  }],
  // TPO who created this posting (for college-specific internships)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
jobPostingSchema.index({ company: 1, isActive: 1 });
jobPostingSchema.index({ category: 1, isActive: 1 });
jobPostingSchema.index({ type: 1, isActive: 1 });
jobPostingSchema.index({ targetColleges: 1, isActive: 1 });
jobPostingSchema.index({ createdBy: 1, isActive: 1 });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
