const rewardTransactionRepository = require('./rewardTransaction.repository');

class RewardTransactionService {
  /**
   * Create a new reward transaction — business logic in Module 7.2.
   */
  async createTransaction(_adminId, _txnData) {
    return { message: 'Create transaction skeleton — implemented in Module 7.2' };
  }

  /**
   * Get reward transaction history for the logged-in volunteer.
   */
  async getHistory(userId, queryParams) {
    const { page, limit } = queryParams;
    return rewardTransactionRepository.findByUser(userId, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
  }
}

module.exports = new RewardTransactionService();
