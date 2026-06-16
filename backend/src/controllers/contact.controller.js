const Contact = require('../models/contact.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendContactInquiryEmail } = require('../services/email.service');
const { sendContactInquirySMS } = require('../services/sms.service');

// Create Inquiry (Public Form Submission)
const createInquiry = catchAsync(async (req, res, next) => {
  const { name, email, subject, message, whatsapp } = req.body;

  const inquiry = await Contact.create({
    name,
    email,
    subject,
    message,
    whatsapp,
  });

  // Trigger background email forwarding (non-blocking)
  sendContactInquiryEmail(inquiry).catch((err) => {
    console.error('Email forwarding failed in background:', err);
  });

  // Trigger background SMS forwarding (non-blocking)
  sendContactInquirySMS(inquiry).catch((err) => {
    console.error('SMS forwarding failed in background:', err);
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been sent successfully.',
    inquiry,
  });
});

// Get All Inquiries (Admin Only)
const getAllInquiries = catchAsync(async (req, res, next) => {
  const inquiries = await Contact.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: inquiries.length,
    inquiries,
  });
});

// Update Inquiry Status (Admin Only)
const updateInquiryStatus = catchAsync(async (req, res, next) => {
  const { status, isRead } = req.body;
  const updateData = {};

  if (status !== undefined) {
    if (!['unread', 'read', 'archived'].includes(status)) {
      return next(new AppError('Invalid status value. Must be "unread", "read", or "archived"', 400));
    }
    updateData.status = status;
    if (status === 'read' || status === 'archived') {
      updateData.isRead = true;
    } else if (status === 'unread') {
      updateData.isRead = false;
    }
  }

  if (isRead !== undefined) {
    updateData.isRead = !!isRead;
    if (updateData.status === undefined) {
      updateData.status = isRead ? 'read' : 'unread';
    }
  }

  if (Object.keys(updateData).length === 0) {
    return next(new AppError('Please provide status or isRead to update', 400));
  }

  const inquiry = await Contact.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!inquiry) {
    return next(new AppError('No inquiry found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    inquiry,
  });
});

// Delete Inquiry (Admin Only)
const deleteInquiry = catchAsync(async (req, res, next) => {
  const inquiry = await Contact.findByIdAndDelete(req.params.id);

  if (!inquiry) {
    return next(new AppError('No inquiry found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Inquiry successfully deleted',
  });
});

module.exports = {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
};
