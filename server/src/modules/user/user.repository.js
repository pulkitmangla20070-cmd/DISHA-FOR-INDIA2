const User = require('./user.model');

class UserRepository {
  /**
   * Find user by ID.
   * @param {string} id - User ID.
   * @returns {Promise<User|null>} The user document.
   */
  async findById(id) {
    return User.findById(id);
  }

  /**
   * Find user by username.
   * @param {string} username - User username.
   * @returns {Promise<User|null>} The user document.
   */
  async findByUsername(username) {
    return User.findOne({ username });
  }

  /**
   * Update user profile fields.
   * @param {string} id - User ID.
   * @param {object} updateData - Fields to update.
   * @returns {Promise<User|null>} The updated user document.
   */
  async updateProfile(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Update user profile photo.
   * @param {string} id - User ID.
   * @param {string} photoUrl - Cloudinary photo URL.
   * @returns {Promise<User|null>} The updated user document.
   */
  async updateProfilePhoto(id, photoUrl) {
    return User.findByIdAndUpdate(
      id,
      { profilePhoto: photoUrl },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update user resume URL.
   * @param {string} id - User ID.
   * @param {string} resumeUrl - Cloudinary resume URL.
   * @returns {Promise<User|null>} The updated user document.
   */
  async updateResume(id, resumeUrl) {
    return User.findByIdAndUpdate(id, { resume: resumeUrl }, { new: true, runValidators: true });
  }

  /**
   * Update profile completion, strength, and volunteer level.
   * @param {string} id - User ID.
   * @param {number} profileCompletion - Completion percentage.
   * @param {string} profileStrength - Strength label.
   * @param {string} volunteerLevel - Level label.
   * @returns {Promise<User|null>} The updated user document.
   */
  async updateProfileProgress(id, profileCompletion, profileStrength, volunteerLevel) {
    return User.findByIdAndUpdate(
      id,
      { profileCompletion, profileStrength, volunteerLevel },
      { new: true }
    );
  }

  /**
   * Get volunteer statistics for a user by ID.
   * Only selects statistical fields for performance.
   * @param {string} id - User ID.
   * @returns {Promise<User|null>} User document with stats fields.
   */
  async getVolunteerStatistics(id) {
    return User.findById(id).select(
      'points hoursCompleted programsJoined programsCompleted certificatesEarned referralCount impactScore volunteerLevel profileCompletion profileStrength'
    );
  }

  /**
   * Search users (with filter, pagination, sorting).
   * @param {object} query - Mongoose query object.
   * @param {object} options - Pagination options (page, limit, sort).
   * @returns {Promise<object>} Object containing results and count.
   */
  async searchUsers(query = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return { users, total };
  }

  /**
   * Find public profile of a user.
   * @param {string} username - User username.
   * @returns {Promise<User|null>} The user document with only public fields.
   */
  async findPublicProfile(username) {
    return User.findOne({ username }).select(
      'name username profilePhoto about college course city state skills points hoursCompleted programsCompleted volunteerLevel profileCompletion profileStrength impactScore'
    );
  }

  async findVolunteersForLeaderboard(skip = 0, limit = 20) {
    return User.find({ role: 'volunteer', isDeleted: false })
      .sort({ points: -1, createdAt: 1 })
      .skip(skip)
      .limit(limit);
  }

async getVolunteerRank(userId) {
    return null;
  }

  async findTopVolunteers(limit = 10) {
    return User.find({ role: 'volunteer', isDeleted: false })
      .sort({ points: -1, createdAt: 1 })
      .limit(limit);
  }

  async countDocuments(query = {}) {
    return User.countDocuments(query);
  }
}

module.exports = new UserRepository();