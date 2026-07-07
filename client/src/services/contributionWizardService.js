import api from './api';

const createDraft = async (data) => {
  const payload = {
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'other',
    contributionType: data.contributionType || 'other',
    skillsUsed: data.skillsUsed || [],
    hoursWorked: data.hoursWorked || 0,
    tags: data.tags || [],
    visibility: data.visibility || 'private',
    metadata: data.metadata || {},
  };

  const res = await api.post('/contributions', payload);
  return res;
};

const saveDraft = async (contributionId, data) => {
  const payload = {
    title: data.title || '',
    description: data.description || '',
    category: data.category,
    contributionType: data.contributionType || 'other',
    skillsUsed: data.skillsUsed || [],
    hoursWorked: data.hoursWorked || 0,
    tags: data.tags || [],
    visibility: data.visibility || 'private',
    files: data.files || [],
    githubUrl: data.githubUrl || null,
    figmaUrl: data.figmaUrl || null,
    canvaUrl: data.canvaUrl || null,
    googleDriveUrl: data.googleDriveUrl || null,
    notes: data.notes || '',
  };

  const res = await api.put(`/contributions/${contributionId}`, payload);
  return res;
};

const submitContribution = async (contributionId) => {
  const res = await api.post(`/contributions/${contributionId}/submit`);
  return res;
};

const getDraft = async (contributionId) => {
  const res = await api.get(`/contributions/${contributionId}`);
  return res;
};

const getMyDrafts = async () => {
  const res = await api.get('/contributions/my', { params: { status: 'draft' } });
  return res;
};

export {
  createDraft,
  saveDraft,
  submitContribution,
  getDraft,
  getMyDrafts,
};

export default {
  createDraft,
  saveDraft,
  submitContribution,
  getDraft,
  getMyDrafts,
};
