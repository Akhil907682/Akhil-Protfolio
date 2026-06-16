const { body } = require('express-validator');

const certificationValidation = [
  body('name')
    .notEmpty()
    .withMessage('Certification name is required')
    .trim(),
  body('issuingOrganization')
    .notEmpty()
    .withMessage('Issuing organization is required')
    .trim(),
  body('issueDate')
    .notEmpty()
    .withMessage('Issue date is required')
    .isISO8601()
    .withMessage('Issue date must be a valid ISO8601 date (YYYY-MM-DD)'),
  body('expirationDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Expiration date must be a valid ISO8601 date (YYYY-MM-DD)')
    .custom((expDate, { req }) => {
      if (expDate && req.body.issueDate) {
        if (new Date(expDate) < new Date(req.body.issueDate)) {
          throw new Error('Expiration date cannot be earlier than issue date');
        }
      }
      return true;
    }),
  body('credentialId')
    .optional()
    .trim(),
  body('credentialUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Credential URL must be a valid URL'),
];

module.exports = {
  certificationValidation,
};
