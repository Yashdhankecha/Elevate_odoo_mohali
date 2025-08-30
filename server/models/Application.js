const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    required: true,
    trim: true
  },
  resume: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedback: {
    type: String,
    trim: true
  },
  interviewDate: Date,
  interviewLocation: String,
  interviewNotes: String,
  salaryExpectation: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  availability: {
    startDate: Date,
    noticePeriod: Number // in days
  }
}, {
  timestamps: true
});

// Index for better query performance
applicationSchema.index({ job: 1, applicant: 1 });
applicationSchema.index({ company: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });
applicationSchema.index({ status: 1, reviewedAt: 1 });

// Ensure unique application per job per applicant
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
