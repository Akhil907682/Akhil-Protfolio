const express = require('express');
const router = express.Router();
const {
  getAllCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
} = require('../controllers/certification.controller');
const { protect } = require('../middleware/auth.middleware');
const { certificationValidation } = require('../validations/certification.validation');
const { validate } = require('../middleware/validation.middleware');

// Public routes
router.get('/', getAllCertifications);
router.get('/:id', getCertification);

// Protected routes (Admin only)
router.post('/', protect, certificationValidation, validate, createCertification);
router.put('/:id', protect, certificationValidation, validate, updateCertification);
router.delete('/:id', protect, deleteCertification);

module.exports = router;
