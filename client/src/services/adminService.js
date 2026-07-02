import api from './api';

/**
 * Fetch high-level statistics for the admin dashboard.
 */
export const getDashboardStatistics = async () => {
  return await api.get('/admin/users/statistics');
};

/**
 * Fetch all users/volunteers for admin management.
 * @param {Object} params - page, limit, role, status, search
 */
export const getAllUsers = async (params = {}) => {
  return await api.get('/admin/users', { params });
};

/**
 * Update a user's role (e.g., promote to coordinator).
 * @param {string} userId
 * @param {string} role
 */
export const updateUserRole = async (userId, role) => {
  return await api.patch(`/admin/users/${userId}/role`, { role });
};

/**
 * Update a user's status (e.g., active, suspended).
 * @param {string} userId
 * @param {string} status
 */
export const updateUserStatus = async (userId, status) => {
  return await api.patch(`/admin/users/${userId}/status`, { status });
};

export default {
  getDashboardStatistics,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
};
