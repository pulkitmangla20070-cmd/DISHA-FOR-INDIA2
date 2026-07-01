const organizationService = require('./organization.service');
const { MESSAGES } = require('./organization.constants');
const { successResponse } = require('../../utils/response');

class OrganizationController {
  createOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.createOrganization(req.user.id, req.body);
      return successResponse(res, 201, MESSAGES.ORGANIZATION_CREATED, result);
    } catch (error) {
      return next(error);
    }
  };

  getOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.getOrganization(req.params.id, req.user.role);
      return successResponse(res, 200, MESSAGES.ORGANIZATION_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  updateOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.updateOrganization(
        req.user.id,
        req.params.id,
        req.body
      );
      return successResponse(res, 200, MESSAGES.ORGANIZATION_UPDATED, result);
    } catch (error) {
      return next(error);
    }
  };

  deleteOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.deleteOrganization(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.ORGANIZATION_DELETED, result);
    } catch (error) {
      return next(error);
    }
  };

  listOrganizations = async (req, res, next) => {
    try {
      const result = await organizationService.listOrganizations(req.query);
      return successResponse(res, 200, 'Organizations retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new OrganizationController();
