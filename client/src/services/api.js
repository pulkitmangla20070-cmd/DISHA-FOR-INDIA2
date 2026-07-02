import api from './api';

export const programApi = {
  getAll: (params) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  getMyPrograms: (params) => api.get('/programs/me', { params }),
};

export const applicationApi = {
  create: (data) => api.post('/applications', data),
  getAll: (params) => api.get('/applications', { params }),
  getMyApplications: (params) => api.get('/applications/me', { params }),
};

export const leaderboardApi = {
  getAll: (params) => api.get('/leaderboard', { params }),
};

export const certificateApi = {
  getAll: (params) => api.get('/certificates', { params }),
  getMyCertificates: (params) => api.get('/certificates/me', { params }),
};

export const rewardApi = {
  getMyRewards: (params) => api.get('/rewards/me', { params }),
};

export const organizationApi = {
  getAll: (params) => api.get('/organizations', { params }),
  getById: (id) => api.get(`/organizations/${id}`),
};

export const roleApi = {
  getAll: (params) => api.get('/roles', { params }),
};

export const permissionApi = {
  getAll: (params) => api.get('/permissions', { params }),
};