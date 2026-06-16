const { body } = require('express-validator');

const skillValidation = [
  body('name')
    .notEmpty()
    .withMessage('Skill name is required')
    .trim(),
  body('category')
    .notEmpty()
    .withMessage('Skill category is required')
    .trim(),
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Level must be one of: Beginner, Intermediate, Advanced, Expert'),
  body('percentage')
    .notEmpty()
    .withMessage('Percentage is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('Percentage must be an integer between 0 and 100'),
  body('icon')
    .optional()
    .trim(),
];

module.exports = {
  skillValidation,
};
