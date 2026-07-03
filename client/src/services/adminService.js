import api from '../services/api';

/**
 * Admin service utilities.
 * Currently provides a soft‑delete operation for users.
 */
export const softDeleteUser = async (userId) => {
  // Assuming the backend has a PATCH endpoint that sets isDeleted flag.
  // If the backend uses DELETE, change the method accordingly.
  try {
    const res = await api.patch(`/admin/users/${userId}`, { isDeleted: true });
    return res;
  } catch (err) {
    throw err;
  }
};
