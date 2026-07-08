const cloudinary = require('cloudinary').v2;
const ApiError = require('./ApiError');

// Configure once — reads from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer (from multer memoryStorage) to Cloudinary.
 * @param {Buffer} fileBuffer   - The file buffer from req.file.buffer
 * @param {string} folder       - Cloudinary folder path (e.g. 'elevate/logos')
 * @param {object} options      - Extra cloudinary upload options
 * @returns {Promise<object>}   - Cloudinary upload result { url, public_id, ... }
 */
const uploadToCloudinary = (fileBuffer, folder = 'elevate', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) reject(new ApiError(500, `Cloudinary upload failed: ${error.message}`));
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary by its public_id.
 * @param {string} publicId   - The Cloudinary public_id of the asset
 * @returns {Promise<object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new ApiError(500, `Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Extract the public_id from a full Cloudinary URL.
 * Useful when you store the URL and need to delete it later.
 * @param {string} url - Full Cloudinary URL
 * @returns {string|null} - public_id or null
 */
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    // Skip version segment (v1234567) if present
    let startIdx = uploadIndex + 1;
    if (/^v\d+$/.test(parts[startIdx])) startIdx++;
    const pathWithExt = parts.slice(startIdx).join('/');
    return pathWithExt.replace(/\.[^.]+$/, ''); // remove extension
  } catch {
    return null;
  }
};

/**
 * Check if Cloudinary is properly configured.
 * @returns {boolean}
 */
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  isCloudinaryConfigured,
};
