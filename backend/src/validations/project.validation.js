const { body } = require('express-validator');

const projectValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('technologies')
    .custom((value) => {
      if (!value) {
        throw new Error('Technologies list is required');
      }
      let parsed = value;
      if (typeof value === 'string') {
        try {
          parsed = JSON.parse(value);
        } catch (e) {
          // Fallback to split by comma
          parsed = value.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Technologies must be a non-empty array or a comma-separated string');
      }
      return true;
    }),
  body('githubLink')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('GitHub link must be a valid URL'),
  body('liveLink')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Live project link must be a valid URL'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];

module.exports = {
  projectValidation,
};
