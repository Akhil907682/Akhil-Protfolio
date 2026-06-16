const express = require('express');
const router = express.Router();
const {
  getAllSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skill.controller');
const { protect } = require('../middleware/auth.middleware');
const { skillValidation } = require('../validations/skill.validation');
const { validate } = require('../middleware/validation.middleware');

// Public routes
router.get('/', getAllSkills);
router.get('/:id', getSkill);

// Protected routes (Admin only)
router.post('/', protect, skillValidation, validate, createSkill);
router.put('/:id', protect, skillValidation, validate, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
