const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/error.middleware');
const { trackVisitor } = require('./middleware/visitor.middleware');
const apiRoutes = require('./routes');

const app = express();

// 1. Global Security Middlewares
// Set secure HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows displaying local uploaded images in the browser
}));

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting to prevent brute force / DDoS (15 minutes, 100 requests per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// 2. Logging and Parsing
// HTTP request logging via Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 3. Static Files Serving (fallback local uploads directory)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// 4. Custom Middlewares
// Track daily unique visitors
app.use(trackVisitor);

// 5. Mount API Routes
app.use('/api', apiRoutes);

// Root endpoint for status check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio Backend API is running successfully.',
    environment: process.env.NODE_ENV || 'production',
    owner: 'Akhil Singh'
  });
});

// 6. Handle Undefined Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 7. Global Error Handler Middleware
app.use(globalErrorHandler);

module.exports = app;
