/* Logging service for client-side error reporting */
// In development we log to console; in production we attempt to POST to a backend logging endpoint.
export const logMalformedResponse = async (payload) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Malformed API response logged:', payload);
      return;
    }
    // Adjust the endpoint as needed; using a generic /api/v1/log path.
    await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'malformed_response',
        payload,
        timestamp: new Date().toISOString(),
      }),
      credentials: 'include',
    });
  } catch (e) {
    console.error('Failed to send malformed response to logging endpoint:', e);
  }
};

export default { logMalformedResponse };
