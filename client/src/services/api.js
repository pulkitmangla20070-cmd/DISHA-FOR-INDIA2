import axios from 'axios';

// Create an instance of axios with base configurations
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial to allow HTTP-only cookies to be sent/received
});

// Track if we're in the middle of an auth check
let isAuthCheck = false;

// Interceptor to handle responses globally (e.g. logouts on 401s)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If the backend returns a 401 Unauthorized, we know the session has expired
    // Only redirect if this wasn't an intentional auth check
    if (error.response && error.response.status === 401 && !isAuthCheck) {
      // Clear any client side local state if required, and redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    
    // Normalize errors to return the message from the backend if available
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default axiosClient;

// Auth check wrapper that prevents redirect
export const authCheck = async () => {
  isAuthCheck = true;
  try {
    const res = await axiosClient.get('/auth/me');
    return res;
  } finally {
    isAuthCheck = false;
  }
};

export const programApi = {
  getAll: (params) => axiosClient.get('/programs', { params }),
  getById: (id) => axiosClient.get(`/programs/${id}`),
  getMyPrograms: (params) => axiosClient.get('/programs/me', { params }),
};

export const applicationApi = {
  create: (data) => axiosClient.post('/applications', data),
  getAll: (params) => axiosClient.get('/applications', { params }),
  getMyApplications: (params) => axiosClient.get('/applications/me', { params }),
};

export const leaderboardApi = {
  getAll: (params) => axiosClient.get('/leaderboard', { params }),
};

export const certificateApi = {
  getAll: (params) => axiosClient.get('/certificates', { params }),
  getMyCertificates: (params) => axiosClient.get('/certificates/me', { params }),
};

export const rewardApi = {
  getMyRewards: (params) => axiosClient.get('/rewards/me', { params }),
};

export const organizationApi = {
  getAll: (params) => axiosClient.get('/organizations', { params }),
  getById: (id) => axiosClient.get(`/organizations/${id}`),
};

export const roleApi = {
  getAll: (params) => axiosClient.get('/roles', { params }),
};

export const permissionApi = {
  getAll: (params) => axiosClient.get('/permissions', { params }),
};