const Skill = require('../models/skill.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get All Skills
const getAllSkills = catchAsync(async (req, res, next) => {
  const skills = await Skill.find().sort({ category: 1, percentage: -1 });

  res.status(200).json({
    success: true,
    count: skills.length,
    skills,
  });
});

// Get Single Skill
const getSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    skill,
  });
});

// Create Skill
const createSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.create(req.body);

  res.status(201).json({
    success: true,
    skill,
  });
});

// Update Skill
const updateSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    skill,
  });
});

// Delete Skill
const deleteSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);

  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Skill successfully deleted',
  });
});

module.exports = {
  getAllSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
};
