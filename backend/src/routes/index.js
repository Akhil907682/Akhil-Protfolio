const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const skillRoutes = require('./skill.routes');
const educationRoutes = require('./education.routes');
const certificationRoutes = require('./certification.routes');
const contactRoutes = require('./contact.routes');
const resumeRoutes = require('./resume.routes');
const dashboardRoutes = require('./dashboard.routes');

// Mount child routers
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/education', educationRoutes);
router.use('/certifications', certificationRoutes);
router.use('/contacts', contactRoutes);
router.use('/resume', resumeRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
