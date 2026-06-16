const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');
const { projectValidation } = require('../validations/project.validation');
const { validate } = require('../middleware/validation.middleware');

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProject);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), projectValidation, validate, createProject);
router.put('/:id', protect, upload.single('image'), projectValidation, validate, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
