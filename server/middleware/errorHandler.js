/**
 * middleware/errorHandler.js
 * Centralised Express error handler — must be registered AFTER all routes in server.js.
 * Handles: ApiError, Mongoose errors, Multer, JWT, and unknown errors.
 */

const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  // ── Operational / known errors ───────────────────────────────────────────────
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors?.length && { errors: err.errors }),
    });
  }

  // ── Multer ───────────────────────────────────────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'File too large. Maximum allowed size is 10 MB.' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, message: 'Unexpected file field.' });
  }

  // ── Mongoose validation ───────────────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // ── Mongoose duplicate key ────────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} already exists.` });
  }

  // ── Mongoose cast error (bad ObjectId) ───────────────────────────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid value for ${err.path}` });
  }

  // ── JWT ───────────────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid token.' });
  if (err.name === 'TokenExpiredError')  return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });

  // ── Unknown / programmer error ────────────────────────────────────────────────
  console.error(' Unhandled error:', err.message, err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
