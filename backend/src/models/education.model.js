const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Please provide the institution name'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Please provide the degree name'],
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      required: [true, 'Please provide the field of study'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide the start date'],
    },
    endDate: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;
