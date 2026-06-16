const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/contact.controller');
const { protect } = require('../middleware/auth.middleware');
const { contactValidation } = require('../validations/contact.validation');
const { validate } = require('../middleware/validation.middleware');

// Strict rate limiter for contact form inquiries (Max 20 submissions per 15 minutes per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many messages sent from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public route (with rate limiting and validation)
router.post('/', contactLimiter, contactValidation, validate, createInquiry);

// Protected routes (Admin only)
router.get('/', protect, getAllInquiries);
router.patch('/:id', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
// Force Nodemon reload

