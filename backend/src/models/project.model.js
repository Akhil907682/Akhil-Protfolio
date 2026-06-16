const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A project must have a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A project must have a description'],
      trim: true,
    },
    technologies: {
      type: [String],
      required: [true, 'A project must have technologies listed'],
    },
    imageUrl: {
      type: String,
      required: [true, 'A project must have an image URL'],
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    githubLink: {
      type: String,
      default: '',
    },
    liveLink: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
