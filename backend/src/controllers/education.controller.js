const Education = require('../models/education.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get All Education Records
const getAllEducation = catchAsync(async (req, res, next) => {
  const education = await Education.find().sort({ startDate: -1 });

  res.status(200).json({
    success: true,
    count: education.length,
    education,
  });
});

// Get Single Education Record
const getEducation = catchAsync(async (req, res, next) => {
  const record = await Education.findById(req.params.id);

  if (!record) {
    return next(new AppError('No education record found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    education: record,
  });
});

// Create Education Record
const createEducation = catchAsync(async (req, res, next) => {
  const record = await Education.create(req.body);

  res.status(201).json({
    success: true,
    education: record,
  });
});

// Update Education Record
const updateEducation = catchAsync(async (req, res, next) => {
  const record = await Education.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    return next(new AppError('No education record found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    education: record,
  });
});

// Delete Education Record
const deleteEducation = catchAsync(async (req, res, next) => {
  const record = await Education.findByIdAndDelete(req.params.id);

  if (!record) {
    return next(new AppError('No education record found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Education record successfully deleted',
  });
});

module.exports = {
  getAllEducation,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};
