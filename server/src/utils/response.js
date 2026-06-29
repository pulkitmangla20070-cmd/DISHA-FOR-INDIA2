/**
 * Format a successful API response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object|array} data - Response payload
 */
const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Format an error API response (usually used in global error handler).
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {array} errors - Additional error details (e.g. validation errors)
 * @param {string} stack - Error stack trace (only in development)
 */
const errorResponse = (res, statusCode, message, errors = [], stack = null) => {
  const response = {
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
  };

  if (process.env.NODE_ENV === 'development' && stack) {
    response.stack = stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
