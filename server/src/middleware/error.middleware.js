// ============================================
// error.middleware.js - Global Error Handling
// ============================================

/**
 * 404 Handler - When a route doesn't exist.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global Error Handler - Catches all unhandled errors.
 * Masks stack traces when NODE_ENV is set to 'production'.
 */
export const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.error('Unhandled Error:', isProduction ? err.message : err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500
      ? 'An unexpected server error occurred. Please try again later.'
      : err.message || 'Something went wrong on the server.',
    ...(isProduction ? {} : { stack: err.stack })
  });
};
