/* eslint-disable no-unused-vars */
/**
 * Authentication middleware skeleton.
 * Will be fully implemented in Module 2.2+.
 */
const authenticate = async (req, res, next) => {
  // Mock user for testing skeleton if needed, or simply pass through
  req.user = {
    id: 'mock_user_id_12345',
    email: 'mock.volunteer@disha.org',
    role: 'volunteer',
  };
  next();
};

/**
 * Authorization middleware skeleton.
 * @param {...string} roles - Allowed roles for this route.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Pass through for skeleton
    next();
  };
};

/**
 * Optional authentication middleware skeleton.
 */
const optionalAuth = async (req, res, next) => {
  // Pass through for skeleton
  next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
