const Project = require('../models/project.model');
const Skill = require('../models/skill.model');
const Contact = require('../models/contact.model');
const Visitor = require('../models/visitor.model');
const Education = require('../models/education.model');
const Certification = require('../models/certification.model');
const Resume = require('../models/resume.model');
const catchAsync = require('../utils/catchAsync');

// Retrieve Portfolio Dashboard Metrics
const getStats = catchAsync(async (req, res, next) => {
  const [
    totalVisitors,
    totalMessages,
    totalProjects,
    totalSkills,
    totalEducation,
    totalCertifications,
    totalResumes,
    recentMessages,
  ] = await Promise.all([
    Visitor.countDocuments(),
    Contact.countDocuments(),
    Project.countDocuments(),
    Skill.countDocuments(),
    Education.countDocuments(),
    Certification.countDocuments(),
    Resume.countDocuments(),
    Contact.find().sort({ createdAt: -1 }).limit(5), // Latest 5 messages
  ]);

  // Retrieve unread messages count
  const unreadMessages = await Contact.countDocuments({ status: 'unread' });

  res.status(200).json({
    success: true,
    stats: {
      totalVisitors,
      totalMessages,
      unreadMessages,
      totalProjects,
      totalSkills,
      totalEducation,
      totalCertifications,
      totalResumes,
    },
    recentMessages,
  });
});

module.exports = {
  getStats,
};
