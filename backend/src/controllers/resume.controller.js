const Resume = require('../models/resume.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { uploadFile, deleteFile } = require('../services/upload.service');
const path = require('path');
const fs = require('fs');

// Get all resumes metadata
const getAllResumes = catchAsync(async (req, res, next) => {
  const resumes = await Resume.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: resumes.length,
    resumes,
  });
});

// Upload a new resume
const uploadResume = catchAsync(async (req, res, next) => {
  const { roleName } = req.body;

  if (!roleName) {
    return next(new AppError('Please provide a job role name for this resume', 400));
  }

  if (!req.file) {
    return next(new AppError('Please upload a resume PDF file', 400));
  }

  // Check if a resume with this role name already exists
  const existingResume = await Resume.findOne({ roleName: { $regex: new RegExp(`^${roleName.trim()}$`, 'i') } });
  if (existingResume) {
    return next(new AppError(`A resume for the role "${roleName}" already exists. Please delete or edit the existing one.`, 400));
  }

  // Upload file to storage
  const uploadResult = await uploadFile(req.file, 'resumes');

  // Create new resume record
  const resume = await Resume.create({
    roleName: roleName.trim(),
    fileUrl: uploadResult.url,
    publicId: uploadResult.publicId,
  });

  res.status(201).json({
    success: true,
    message: 'Resume uploaded successfully',
    resume,
  });
});

// Update an existing resume
const updateResume = catchAsync(async (req, res, next) => {
  const { roleName } = req.body;
  const resumeId = req.params.id;

  const resume = await Resume.findById(resumeId);
  if (!resume) {
    return next(new AppError('No resume found with that ID', 404));
  }

  // Check if roleName is updated and already exists elsewhere
  if (roleName && roleName.trim() !== resume.roleName) {
    const existingResume = await Resume.findOne({ 
      _id: { $ne: resumeId },
      roleName: { $regex: new RegExp(`^${roleName.trim()}$`, 'i') } 
    });
    if (existingResume) {
      return next(new AppError(`A resume for the role "${roleName}" already exists.`, 400));
    }
    resume.roleName = roleName.trim();
  }

  // If a new file is uploaded
  if (req.file) {
    // Delete the old file from storage
    await deleteFile(resume.publicId);

    // Upload new file
    const uploadResult = await uploadFile(req.file, 'resumes');
    resume.fileUrl = uploadResult.url;
    resume.publicId = uploadResult.publicId;
    resume.uploadDate = Date.now();
  }

  await resume.save();

  res.status(200).json({
    success: true,
    message: 'Resume updated successfully',
    resume,
  });
});

// Delete a resume
const deleteResume = catchAsync(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return next(new AppError('No resume found with that ID', 404));
  }

  // Delete physical file
  await deleteFile(resume.publicId);

  // Delete from database
  await Resume.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Resume deleted successfully',
  });
});

// Download resume file directly
const downloadResume = catchAsync(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return next(new AppError('No resume found with that ID', 404));
  }

  // If local fallback storage is being used
  if (resume.fileUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '../../uploads', resume.publicId);
    
    if (!fs.existsSync(filePath)) {
      return next(new AppError('Resume file not found on local server storage', 404));
    }
    
    // Set headers and initiate direct binary download
    const cleanRoleName = resume.roleName.replace(/[^a-zA-Z0-9]/g, '_');
    return res.download(filePath, `Akhil_Singh_Resume_${cleanRoleName}.pdf`);
  }

  // If Cloudinary storage is active, redirect browser to the file
  return res.redirect(resume.fileUrl);
});

// View resume file inline in browser
const viewResume = catchAsync(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return next(new AppError('No resume found with that ID', 404));
  }

  // If local fallback storage is being used
  if (resume.fileUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '../../uploads', resume.publicId);
    
    if (!fs.existsSync(filePath)) {
      return next(new AppError('Resume file not found on local server storage', 404));
    }
    
    // Set headers for inline view
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    return fs.createReadStream(filePath).pipe(res);
  }

  // If Cloudinary storage is active, redirect browser to the file
  return res.redirect(resume.fileUrl);
});

module.exports = {
  getAllResumes,
  uploadResume,
  updateResume,
  deleteResume,
  downloadResume,
  viewResume,
};
