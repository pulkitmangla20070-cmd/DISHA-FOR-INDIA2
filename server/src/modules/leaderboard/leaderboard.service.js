const userRepository = require('../user/user.repository');
const { VALIDATION } = require('./leaderboard.constants');

class LeaderboardService {
  async getLeaderboard(queryParams) {
    const { page, limit } = queryParams;

    const validPage = Math.max(1, parseInt(page, 10) || VALIDATION.DEFAULT_PAGE);
    const validLimit = Math.min(
      Math.max(1, parseInt(limit, 10) || VALIDATION.DEFAULT_LIMIT),
      VALIDATION.MAX_LIMIT
    );

    const skip = (validPage - 1) * validLimit;

    const [users, total] = await Promise.all([
      userRepository.findVolunteersForLeaderboard(skip, validLimit),
      userRepository.countDocuments({ role: 'volunteer', isDeleted: false }),
    ]);

    const leaderboard = users.map((user) => ({
      _id: user._id,
      name: user.name,
      profilePhoto: user.profilePhoto || '',
      volunteerLevel: user.volunteerLevel || 'Beginner',
      points: user.points || 0,
      hoursCompleted: user.hoursCompleted || 0,
      programsCompleted: user.programsCompleted || 0,
      impactScore: user.impactScore || 0,
    }));

    return {
      leaderboard,
      total,
      page: validPage,
      limit: validLimit,
    };
  }

  async refreshLeaderboard(_adminId) {
    return { refreshed: 0, message: 'Leaderboard is now generated directly from User collection' };
  }

  async getMyRank(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      return null;
    }
    const rank = await userRepository.getVolunteerRank(user._id);
    if (!rank) {
      return null;
    }
    return {
      _id: user._id,
      name: user.name,
      profilePhoto: user.profilePhoto || '',
      volunteerLevel: user.volunteerLevel || 'Beginner',
      points: user.points || 0,
      hoursCompleted: user.hoursCompleted || 0,
      programsCompleted: user.programsCompleted || 0,
      impactScore: user.impactScore || 0,
    };
  }

  async getTopVolunteers(queryParams) {
    const { limit } = queryParams;

    const validLimit = Math.min(
      Math.max(1, parseInt(limit, 10) || VALIDATION.DEFAULT_TOP_LIMIT),
      VALIDATION.MAX_LIMIT
    );

    const users = await userRepository.findTopVolunteers(validLimit);

    return users.map((user) => ({
      _id: user._id,
      name: user.name,
      profilePhoto: user.profilePhoto || '',
      volunteerLevel: user.volunteerLevel || 'Beginner',
      points: user.points || 0,
      hoursCompleted: user.hoursCompleted || 0,
      programsCompleted: user.programsCompleted || 0,
      impactScore: user.impactScore || 0,
    }));
  }
}

module.exports = new LeaderboardService();