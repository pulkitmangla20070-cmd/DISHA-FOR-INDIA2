/* Logging service for client-side error reporting */
import api from './api';

// In development we log to console; in production we attempt to POST to a backend logging endpoint.
export const logMalformedResponse = async (payload) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Malformed API response logged:', payload);
      return;
    }
    // Use relative path since api base already includes /api/v1
    await api.post('log', {
      type: 'malformed_response',
      payload,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Failed to send malformed response to logging endpoint:', e);
  }
};

export default { logMalformedResponse };
