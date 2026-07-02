import api from './api';

/**
 * Get all certificates for the current user.
 */
export const getMyCertificates = async () => {
  return await api.get('/certificates/me');
};

/**
 * Download a certificate PDF.
 * @param {string} id - Certificate ID
 */
export const downloadCertificate = async (id) => {
  return await api.get(`/certificates/${id}/download`, { responseType: 'blob' });
};

/**
 * Verify a certificate by its unique number (Public route).
 * @param {string} certificateNumber 
 */
export const verifyCertificate = async (certificateNumber) => {
  return await api.get(`/certificates/verify/${certificateNumber}`);
};

/**
 * Admin: Auto-generate certificates for a completed program.
 * @param {string} programId 
 */
export const autoGenerateCertificates = async (programId) => {
  return await api.post(`/certificates/admin/auto-generate/${programId}`);
};

export default {
  getMyCertificates,
  downloadCertificate,
  verifyCertificate,
  autoGenerateCertificates,
};
