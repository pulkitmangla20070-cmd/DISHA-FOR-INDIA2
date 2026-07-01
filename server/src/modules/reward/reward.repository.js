const Reward = require('./reward.model');

class RewardRepository {
  async create(rewardData) {
    return Reward.create(rewardData);
  }

  async findByUser(userId) {
    return Reward.findOne({ user: userId }).populate('user', 'name email volunteerId');
  }

  async update(userId, updateData) {
    return Reward.findOneAndUpdate({ user: userId }, updateData, {
      new: true,
      runValidators: true,
      upsert: false,
    });
  }
}

module.exports = new RewardRepository();
