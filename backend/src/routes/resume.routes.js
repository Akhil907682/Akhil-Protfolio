const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllResumes,
  uploadResume,
  updateResume,
  deleteResume,
  downloadResume,
  viewResume,
} = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');
const { isCloudinaryConfigured } = require('../config/cloudinary');

// Dedicated Multer configuration for Resumes (PDF only, 5MB limit)
const resumeFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

const storage = isCloudinaryConfigured ? multer.memoryStorage() : multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}.pdf`);
  }
});

const uploadResumePDF = multer({
  storage,
  fileFilter: resumeFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to handle multer size limit or validation errors gracefully
const handleUpload = (req, res, next) => {
  const uploadSingle = uploadResumePDF.single('resume');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File is too large. Maximum file size allowed is 5MB.'
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

// Public routes
router.get('/', getAllResumes);
router.get('/:id/download', downloadResume);
router.get('/:id/view', viewResume);

// Protected routes (Admin only)
router.post('/', protect, handleUpload, uploadResume);
router.put('/:id', protect, handleUpload, updateResume);
router.delete('/:id', protect, deleteResume);

module.exports = router;
