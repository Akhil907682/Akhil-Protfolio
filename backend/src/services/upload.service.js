const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

/**
 * Uploads a file (either via Cloudinary API stream or local directory path fallback)
 * @param {Object} file - Express Multer file object
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Object>} { url, publicId }
 */
const uploadFile = async (file, folder = 'portfolio') => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder,
          resource_type: 'auto' // automatically detect image/pdf
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    // If not configured, multer already saved it to /uploads/ folder (if diskStorage)
    // and we generate the server relative URL path.
    // In case of memoryStorage (which shouldn't happen if isCloudinaryConfigured is false, 
    // but just in case, we write a safety fallback)
    if (file.buffer) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
      const uploadDir = path.join(__dirname, '../../uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      
      return {
        url: `/uploads/${filename}`,
        publicId: filename
      };
    }
    
    // Normal disk storage return
    return {
      url: `/uploads/${file.filename}`,
      publicId: file.filename
    };
  }
};

/**
 * Deletes a file from either Cloudinary or local uploads folder
 * @param {String} publicId - Cloudinary publicId or local filename
 */
const deleteFile = async (publicId) => {
  if (!publicId) return;

  if (isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Error deleting file from Cloudinary (publicId: ${publicId}):`, error.message);
    }
  } else {
    const filePath = path.join(__dirname, '../../uploads', publicId);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Error deleting local file (filename: ${publicId}):`, error.message);
      }
    }
  }
};

module.exports = {
  uploadFile,
  deleteFile
};
