const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate: {
    type: String,
    required: true,
    trim: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for backward compatibility
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Technical', 'HR Round', 'Managerial', 'Final'],
    default: 'Technical'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  interviewer: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    default: '60',
    enum: ['30', '45', '60', '90']
  },
  notes: {
    type: String,
    trim: true
  },
  feedback: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  result: {
    type: String,
    enum: ['Passed', 'Failed', 'On Hold', 'Not Evaluated'],
    default: 'Not Evaluated'
  }
}, {
  timestamps: true
});

// Index for better query performance
interviewSchema.index({ company: 1, status: 1 });
interviewSchema.index({ date: 1 });
interviewSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
