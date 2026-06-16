const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => `${err.path}: ${err.msg}`).join(' | ');
    return next(new AppError(`Validation error: ${formattedErrors}`, 400));
  }
  next();
};

module.exports = { validate };
