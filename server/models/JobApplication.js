const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'test_scheduled', 'test_completed', 'interview_scheduled', 'interview_completed', 'offer_received', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  testDate: Date,
  testScore: Number,
  interviewDate: Date,
  interviewFeedback: String,
  offerDetails: {
    package: String,
    role: String,
    joiningDate: Date
  },
  notes: String,
  resume: String, // URL to uploaded resume
  coverLetter: String, // URL to uploaded cover letter
  attachments: [String], // Array of URLs to additional documents
  timeline: [{
    action: String,
    date: Date,
    description: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
jobApplicationSchema.index({ student: 1, status: 1 });
jobApplicationSchema.index({ company: 1, status: 1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
