const express = require('express');
const router = express.Router();
const {
  getAllEducation,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require('../controllers/education.controller');
const { protect } = require('../middleware/auth.middleware');
const { educationValidation } = require('../validations/education.validation');
const { validate } = require('../middleware/validation.middleware');

// Public routes
router.get('/', getAllEducation);
router.get('/:id', getEducation);

// Protected routes (Admin only)
router.post('/', protect, educationValidation, validate, createEducation);
router.put('/:id', protect, educationValidation, validate, updateEducation);
router.delete('/:id', protect, deleteEducation);

module.exports = router;
