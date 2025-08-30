const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['data-structures', 'algorithms', 'system-design', 'database', 'web-development', 'machine-learning', 'soft-skills'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    studentAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  feedback: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String]
  }
}, {
  timestamps: true
});

// Index for efficient queries
practiceSessionSchema.index({ student: 1, completedAt: -1 });
practiceSessionSchema.index({ student: 1, category: 1 });

module.exports = mongoose.model('PracticeSession', practiceSessionSchema);
