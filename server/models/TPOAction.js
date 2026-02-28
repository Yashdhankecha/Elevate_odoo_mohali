const mongoose = require('mongoose');

const tpoActionSchema = new mongoose.Schema({
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  tpo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TPO',
    required: true
  },
  action: {
    type: String,
    enum: ['approved', 'rejected', 'changes_requested', 'resubmitted'],
    required: true
  },
  comments: {
    type: String,
    trim: true
  },
  actionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

tpoActionSchema.index({ jobPosting: 1, actionDate: -1 });
tpoActionSchema.index({ tpo: 1 });

module.exports = mongoose.model('TPOAction', tpoActionSchema);
