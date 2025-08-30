const mongoose = require('mongoose');

const skillProgressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'soft-skills'],
    required: true
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  practiceSessions: [{
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticeSession'
    },
    score: Number,
    date: Date
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  targetProficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  notes: String
}, {
  timestamps: true
});

// Index for efficient queries
skillProgressSchema.index({ student: 1, category: 1 });
skillProgressSchema.index({ student: 1, skill: 1 });

module.exports = mongoose.model('SkillProgress', skillProgressSchema);
