import api from './api';

/**
 * Get all public programs (available to all users).
 */
export const getPrograms = async (params = {}) => {
  return await api.get('/programs', { params });
};

/**
 * Get all programs for admin (requires admin role).
 */
export const getAllPrograms = async (params = {}) => {
  return await api.get('/programs', { params });
};

/**
 * Create a new program (admin only).
 */
export const createProgram = async (data) => {
  return await api.post('/programs', data);
};

/**
 * Update an existing program (admin only).
 */
export const updateProgram = async (id, data) => {
  return await api.put(`/programs/${id}`, data);
};

/**
 * Delete a program (admin only).
 */
export const deleteProgram = async (id) => {
  return await api.delete(`/programs/${id}`);
};

/**
 * Get current user's enrolled programs.
 * Backend route: GET /api/v1/programs/me
 */
export const getJoinedPrograms = async () => {
  return await api.get('/programs/me');
};

/**
 * Get program by ID or slug.
 */
export const getProgramById = async (id) => {
  return await api.get(`/programs/${id}`);
};

/**
 * Get current user's enrolled programs (alias for getJoinedPrograms).
 */
export const getMyPrograms = async () => {
  return await api.get('/programs/me');
};

/**
 * Publish a program (admin only).
 * Backend route: PATCH /api/v1/programs/:id/publish
 */
export const publishProgram = async (id) => {
  return await api.patch(`/programs/${id}/publish`);
};

/**
 * Change a program's status via the dedicated status endpoint.
 * Backend route: PATCH /api/v1/programs/:id/status
 */
export const changeProgramStatus = async (id, status) => {
  return await api.patch(`/programs/${id}/status`, { status });
};

/**
 * Volunteer hours placeholder (backend not implemented yet).
 */
export const getVolunteerHours = async () => {
  return {
    success: true,
    data: {
      lifetime: 0,
      monthly: 0,
      weekly: 0,
    },
  };
};

export default {
  getPrograms,
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getJoinedPrograms,
  getProgramById,
  getMyPrograms,
  publishProgram,
  changeProgramStatus,
  getVolunteerHours,
};