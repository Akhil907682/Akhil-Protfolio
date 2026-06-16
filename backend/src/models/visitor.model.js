const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ipHash: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: {
    type: String,
    default: '',
  },
  visitedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure we can easily query unique visitors per day
visitorSchema.index({ ipHash: 1, visitedAt: -1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
