const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Please provide the job role name for this resume'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide the resume file URL'],
    },
    publicId: {
      type: String,
      default: '',
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
