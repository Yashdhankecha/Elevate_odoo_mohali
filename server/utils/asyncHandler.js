/**
 * asyncHandler
 * Wraps async route handlers to automatically forward errors to Express's
 * global error handling middleware — eliminates try/catch in every controller.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => {
 *     // No try/catch needed — errors auto-forwarded to next(err)
 *   }));
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
