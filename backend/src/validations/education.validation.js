const { body } = require('express-validator');

const educationValidation = [
  body('institution')
    .notEmpty()
    .withMessage('Institution name is required')
    .trim(),
  body('degree')
    .notEmpty()
    .withMessage('Degree is required')
    .trim(),
  body('fieldOfStudy')
    .notEmpty()
    .withMessage('Field of study is required')
    .trim(),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date (YYYY-MM-DD)'),
  body('endDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date (YYYY-MM-DD)')
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate) {
        if (new Date(endDate) < new Date(req.body.startDate)) {
          throw new Error('End date cannot be earlier than start date');
        }
      }
      return true;
    }),
  body('current')
    .optional()
    .isBoolean()
    .withMessage('Current must be a boolean value'),
  body('description')
    .optional()
    .trim(),
];

module.exports = {
  educationValidation,
};
