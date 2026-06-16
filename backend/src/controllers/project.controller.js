const Project = require('../models/project.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { uploadFile, deleteFile } = require('../services/upload.service');

// Get All Projects
const getAllProjects = catchAsync(async (req, res, next) => {
  // Sort by 'order' ascending (or creation date if order is equal)
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
});

// Get Single Project
const getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    project,
  });
});

// Create Project
const createProject = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a project image', 400));
  }

  // Parse technologies from input (handles JSON string or array)
  let technologies = req.body.technologies;
  if (typeof technologies === 'string') {
    try {
      technologies = JSON.parse(technologies);
    } catch (e) {
      technologies = technologies.split(',').map(tech => tech.trim()).filter(Boolean);
    }
  }

  // Upload image to Cloudinary/Local folder
  const uploadResult = await uploadFile(req.file, 'projects');

  const projectData = {
    title: req.body.title,
    description: req.body.description,
    technologies,
    imageUrl: uploadResult.url,
    imagePublicId: uploadResult.publicId,
    githubLink: req.body.githubLink || '',
    liveLink: req.body.liveLink || '',
    featured: req.body.featured === 'true' || req.body.featured === true,
    order: req.body.order ? parseInt(req.body.order, 10) : 0,
  };

  const project = await Project.create(projectData);

  res.status(201).json({
    success: true,
    project,
  });
});

// Update Project
const updateProject = catchAsync(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  // Parse technologies if provided
  let technologies = req.body.technologies;
  if (technologies) {
    if (typeof technologies === 'string') {
      try {
        technologies = JSON.parse(technologies);
      } catch (e) {
        technologies = technologies.split(',').map(tech => tech.trim()).filter(Boolean);
      }
    }
  }

  const updatedData = {
    title: req.body.title || project.title,
    description: req.body.description || project.description,
    githubLink: req.body.githubLink !== undefined ? req.body.githubLink : project.githubLink,
    liveLink: req.body.liveLink !== undefined ? req.body.liveLink : project.liveLink,
    featured: req.body.featured !== undefined ? (req.body.featured === 'true' || req.body.featured === true) : project.featured,
    order: req.body.order !== undefined ? parseInt(req.body.order, 10) : project.order,
  };

  if (technologies) {
    updatedData.technologies = technologies;
  }

  // Check if a new file is uploaded
  if (req.file) {
    // Delete old image
    if (project.imagePublicId) {
      await deleteFile(project.imagePublicId);
    }
    // Upload new image
    const uploadResult = await uploadFile(req.file, 'projects');
    updatedData.imageUrl = uploadResult.url;
    updatedData.imagePublicId = uploadResult.publicId;
  }

  project = await Project.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    project,
  });
});

// Delete Project
const deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  // Delete image from storage
  if (project.imagePublicId) {
    await deleteFile(project.imagePublicId);
  }

  await Project.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Project and its image successfully deleted',
  });
});

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
