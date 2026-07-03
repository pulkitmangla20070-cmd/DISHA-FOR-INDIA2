const { query, param } = require('express-validator');
const { DATE_RANGES } = require('./analytics.utils');

const DATE_RANGE_VALUES = Object.values(DATE_RANGES);

/**
 * Validation for date range query parameter
 */
const validateDateRange = [
  query('dateRange')
    .optional()
    .isIn([...DATE_RANGE_VALUES, null])
    .withMessage('Invalid date range. Allowed values: today, this_week, this_month, last_month, last_3_months, last_6_months, last_year, or custom'),
];

/**
 * Validation for limit query parameter
 */
const validateLimit = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

/**
 * Validation for pagination
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('sortBy')
    .optional()
    .isString()
    .withMessage('Sort by must be a string'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

/**
 * Validation for program ID parameter
 */
const validateProgramId = [
  param('programId')
    .optional()
    .isMongoId()
    .withMessage('Program ID must be a valid MongoDB ObjectId'),
];

/**
 * Validation for user ID parameter
 */
const validateUserId = [
  param('userId')
    .optional()
    .isMongoId()
    .withMessage('User ID must be a valid MongoDB ObjectId'),
];

module.exports = {
  validateDateRange,
  validateLimit,
  validatePagination,
  validateProgramId,
  validateUserId,
};