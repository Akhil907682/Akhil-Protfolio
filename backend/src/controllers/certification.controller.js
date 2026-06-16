const Certification = require('../models/certification.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get All Certifications
const getAllCertifications = catchAsync(async (req, res, next) => {
  const certifications = await Certification.find().sort({ issueDate: -1 });

  res.status(200).json({
    success: true,
    count: certifications.length,
    certifications,
  });
});

// Get Single Certification
const getCertification = catchAsync(async (req, res, next) => {
  const certification = await Certification.findById(req.params.id);

  if (!certification) {
    return next(new AppError('No certification found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    certification,
  });
});

// Create Certification
const createCertification = catchAsync(async (req, res, next) => {
  const certification = await Certification.create(req.body);

  res.status(201).json({
    success: true,
    certification,
  });
});

// Update Certification
const updateCertification = catchAsync(async (req, res, next) => {
  const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!certification) {
    return next(new AppError('No certification found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    certification,
  });
});

// Delete Certification
const deleteCertification = catchAsync(async (req, res, next) => {
  const certification = await Certification.findByIdAndDelete(req.params.id);

  if (!certification) {
    return next(new AppError('No certification found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Certification successfully deleted',
  });
});

module.exports = {
  getAllCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
};
