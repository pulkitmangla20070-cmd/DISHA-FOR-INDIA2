const matchingService = require('./matching.service');
const { MESSAGES } = require('./matching.constants');
const { successResponse } = require('../../utils/response');

class MatchingController {
  getProgramRecommendations = async (req, res, next) => {
    try {
      const result = await matchingService.getProgramRecommendations(req.user, req.query);
      return successResponse(res, 200, MESSAGES.PROGRAMS_RECOMMENDED, result);
    } catch (error) {
      return next(error);
    }
  };

  getVolunteerRecommendations = async (req, res, next) => {
    try {
      const result = await matchingService.getVolunteerRecommendations(req.user, req.query);
      return successResponse(res, 200, MESSAGES.VOLUNTEERS_RECOMMENDED, result);
    } catch (error) {
      return next(error);
    }
  };

  getDetailedRecommendation = async (req, res, next) => {
    try {
      const result = await matchingService.getDetailedRecommendation(req.user, req.query);
      return successResponse(res, 200, MESSAGES.RECOMMENDATION_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new MatchingController();
