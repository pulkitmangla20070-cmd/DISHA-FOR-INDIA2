const express = require('express');
const collaborationController = require('./collaboration.controller');
const {
  validateCreateWorkspace,
  validateUpdateWorkspace,
  validateGetWorkspace,
  validateGetWorkspaces,
  validateAddNote,
  validateAddFile,
  validateAssignTask,
  validateUpdateTask,
} = require('./collaboration.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/workspaces', validateGetWorkspaces, collaborationController.getWorkspaces);

router.get('/workspaces/:id', validateGetWorkspace, collaborationController.getWorkspace);

router.post('/workspaces', validateCreateWorkspace, collaborationController.createWorkspace);

router.patch('/workspaces/:id', validateGetWorkspace, validateUpdateWorkspace, collaborationController.updateWorkspace);

router.delete('/workspaces/:id', validateGetWorkspace, collaborationController.deleteWorkspace);

router.post('/workspaces/:id/join', validateGetWorkspace, collaborationController.joinWorkspace);

router.post('/workspaces/:id/leave', validateGetWorkspace, collaborationController.leaveWorkspace);

router.get('/workspaces/:id/members', validateGetWorkspace, collaborationController.getWorkspaceMembers);

router.post('/workspaces/:id/notes', validateGetWorkspace, validateAddNote, collaborationController.addNote);

router.post('/workspaces/:id/files', validateGetWorkspace, validateAddFile, collaborationController.addFile);

router.post('/workspaces/:id/tasks', validateGetWorkspace, validateAssignTask, collaborationController.assignTask);

router.patch('/workspaces/:id/tasks/:taskIndex', validateGetWorkspace, validateUpdateTask, collaborationController.updateTaskStatus);

router.get('/workspaces/:id/activity-log', validateGetWorkspace, collaborationController.getWorkspaceActivityLog);

module.exports = router;
