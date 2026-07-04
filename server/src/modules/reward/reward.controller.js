const rewardService = require('./reward.service');
const gamificationRepository = require('../leaderboard/gamification.repository');
const { MESSAGES } = require('./reward.constants');
const { successResponse } = require('../../utils/response');

class RewardController {
  /**
   * GET /api/v1/rewards/me
   * Get the reward profile of the logged-in volunteer.
   */
  getMyReward = async (req, res, next) => {
    try {
      const reward = await rewardService.getMyReward(req.user.id);
      const rewards = await gamificationRepository.findUserBadges(req.user.id, { page: 1, limit: 1 });
      const totalPoints = reward?.currentPoints || 0;
      const totalCoins = reward?.currentCoins || 0;
      return successResponse(res, 200, MESSAGES.REWARD_FETCHED, {
        totalPoints,
        totalCoins,
        badges: rewards.badges || [],
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RewardController();
