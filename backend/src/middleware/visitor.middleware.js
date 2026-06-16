const crypto = require('crypto');
const Visitor = require('../models/visitor.model');

const trackVisitor = async (req, res, next) => {
  // Try-catch block to ensure visitor tracking failure doesn't crash user requests
  try {
    // Only track GET requests and ignore internal stats / admin APIs to avoid inflation
    if (
      req.method === 'GET' &&
      !req.originalUrl.includes('/api/dashboard') &&
      !req.originalUrl.includes('/api/auth') &&
      !req.originalUrl.includes('/api/contacts')
    ) {
      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || '';
      
      // Hash IP address to protect privacy (GDPR compliance)
      const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

      // Define today's time bounds
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      // Check if this hash has already logged a visit today
      const alreadyVisitedToday = await Visitor.findOne({
        ipHash,
        visitedAt: {
          $gte: startOfToday,
          $lte: endOfToday
        }
      });

      if (!alreadyVisitedToday) {
        await Visitor.create({
          ipHash,
          userAgent
        });
      }
    }
  } catch (err) {
    // Log error but proceed without interrupting the client request
    console.error('Visitor Tracking Error:', err.message);
  }
  next();
};

module.exports = { trackVisitor };
