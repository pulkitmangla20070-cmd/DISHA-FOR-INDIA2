const rewardRepository = require('./reward.repository');

class RewardService {
  /**
   * Get the reward profile for the currently logged-in volunteer.
   */
  async getMyReward(userId) {
    return rewardRepository.findByUser(userId);
  }

  /**
   * Award rewards to a volunteer — business logic in Module 7.2.
   */
  async awardReward(_userId, _rewardData) {
    return { message: 'Award reward skeleton — implemented in Module 7.2' };
  }

  /**
   * Redeem rewards for a volunteer — business logic in Module 7.2.
   */
  async redeemReward(_userId, _redeemData) {
    return { message: 'Redeem reward skeleton — implemented in Module 7.2' };
  }
}

module.exports = new RewardService();
