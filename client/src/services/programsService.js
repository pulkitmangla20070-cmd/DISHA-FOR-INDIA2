import api from './api';

/**
 * Get all available programs.
 */
export const getPrograms = async (params = {}) => {
  return await api.get('/programs', { params });
};

/**
 * Get current user's enrolled programs.
 * Backend route:
 * GET /api/v1/programs/me
 */
export const getJoinedPrograms = async () => {
  return await api.get('/programs/me');
};

/**
 * Get program by ID.
 */
export const getJoinedProgramById = async (id) => {
  return await api.get(`/programs/${id}`);
};

/**
 * Volunteer hours are NOT implemented in the backend yet.
 * Return an empty object instead of making an invalid API call.
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
  getJoinedPrograms,
  getJoinedProgramById,
  getVolunteerHours,
};