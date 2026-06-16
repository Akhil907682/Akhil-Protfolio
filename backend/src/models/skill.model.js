const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A skill must have a name'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A skill must belong to a category'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    percentage: {
      type: Number,
      required: [true, 'Please provide proficiency percentage'],
      min: [0, 'Percentage cannot be less than 0'],
      max: [100, 'Percentage cannot be more than 100'],
    },
    icon: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
