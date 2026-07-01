const rewardService = require('./reward.service');
const { MESSAGES } = require('./reward.constants');
const { successResponse } = require('../../utils/response');

class RewardController {
  /**
   * GET /api/v1/rewards/me
   * Get the reward profile of the logged-in volunteer.
   */
  getMyReward = async (req, res, next) => {
    try {
      const result = await rewardService.getMyReward(req.user.id);
      return successResponse(res, 200, MESSAGES.REWARD_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RewardController();
