/**
 * @class ApiError
 * Custom error class for consistent operational error handling.
 * Usage: throw new ApiError(404, "Job not found")
 *        throw new ApiError(400, "Validation failed", errorsArray)
 */
class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
