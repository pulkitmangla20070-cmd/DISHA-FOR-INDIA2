import api from './api';

/**
 * Fetch the attendance dashboard summary for the authenticated volunteer.
 * Returns streak, total sessions, monthly breakdown, etc.
 */
export const getAttendanceDashboard = async () => {
  const res = await api.get('/attendance/dashboard');
  return res; // { success, data: { ... dashboard fields } }
};

/**
 * Fetch paginated attendance history records.
 * @param {Object} params - program, dateRange, status, month, page, limit
 */
export const getAttendanceHistory = async (params = {}) => {
  const res = await api.get('/attendance/history', { params });
  return res; // { success, data: { records, pagination } }
};

/**
 * Check in to a program session.
 * @param {string|number} programId
 */
export const checkIn = async (programId) => {
  const res = await api.post('/attendance/check-in', { programId });
  return res; // { success, data: { attendanceId, checkInTime } }
};

/**
 * Check out from an active session.
 * @param {string|number} attendanceId  - ID returned by checkIn
 */
export const checkOut = async (attendanceId) => {
  const res = await api.patch(`/attendance/${attendanceId}/check-out`);
  return res;
};

/**
 * Admin: Get attendance list for admin dashboard.
 */
export const adminGetAttendance = async () => {
  const res = await api.get('/admin/attendance');
  return res;
};

/**
 * Admin: Bulk upload attendance via CSV.
 * @param {FormData} formData - containing the CSV file
 */
export const bulkUploadAttendance = async (formData) => {
  const res = await api.post('/admin/attendance/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

/**
 * Admin: Manually mark attendance for a user.
 * @param {string} userId
 * @param {string} programId
 * @param {string} status - e.g., 'PRESENT', 'ABSENT'
 */
export const manualMarkAttendance = async (userId, programId, status) => {
  const res = await api.post('/admin/attendance/manual', { userId, programId, status });
  return res;
};

export default {
  getAttendanceDashboard,
  getAttendanceHistory,
  checkIn,
  checkOut,
  adminGetAttendance,
  bulkUploadAttendance,
  manualMarkAttendance,
};
