import api from './api';

export const getWorkspaces = async (params = {}) => {
  return api.get('/collaboration/workspaces', { params });
};

export const getWorkspaceById = async (id) => {
  return api.get(`/collaboration/workspaces/${id}`);
};

export const createWorkspace = async (data) => {
  return api.post('/collaboration/workspaces', data);
};

export const updateWorkspace = async (id, data) => {
  return api.patch(`/collaboration/workspaces/${id}`, data);
};

export const deleteWorkspace = async (id) => {
  return api.delete(`/collaboration/workspaces/${id}`);
};

export const joinWorkspace = async (id) => {
  return api.post(`/collaboration/workspaces/${id}/join`);
};

export const leaveWorkspace = async (id) => {
  return api.post(`/collaboration/workspaces/${id}/leave`);
};

export const getWorkspaceMembers = async (id) => {
  return api.get(`/collaboration/workspaces/${id}/members`);
};

export const addNote = async (id, data) => {
  return api.post(`/collaboration/workspaces/${id}/notes`, data);
};

export const addFile = async (id, data) => {
  return api.post(`/collaboration/workspaces/${id}/files`, data);
};

export const assignTask = async (id, data) => {
  return api.post(`/collaboration/workspaces/${id}/tasks`, data);
};

export const updateTaskStatus = async (workspaceId, taskIndex, data) => {
  return api.patch(`/collaboration/workspaces/${workspaceId}/tasks/${taskIndex}`, data);
};

export const getWorkspaceActivityLog = async (id) => {
  return api.get(`/collaboration/workspaces/${id}/activity-log`);
};

export default {
  getWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  joinWorkspace,
  leaveWorkspace,
  getWorkspaceMembers,
  addNote,
  addFile,
  assignTask,
  updateTaskStatus,
  getWorkspaceActivityLog,
};
