const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Helper to sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Admin Login
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if admin exists and password is correct (explicitly select password field)
  const admin = await Admin.findOne({ email }).select('+password');
  
  if (!admin || !(await admin.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Generate JWT token
  const token = signToken(admin._id);

  // Return response
  res.status(200).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
});

// Get Current Admin Details
const getMe = catchAsync(async (req, res, next) => {
  const admin = req.user;
  
  res.status(200).json({
    success: true,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
});

// Change Admin Password
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide both current and new passwords', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('New password must be at least 6 characters', 400));
  }

  const admin = await Admin.findById(req.user._id).select('+password');
  
  if (!(await admin.comparePassword(currentPassword))) {
    return next(new AppError('Incorrect current password', 401));
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
  login,
  getMe,
  changePassword,
};
