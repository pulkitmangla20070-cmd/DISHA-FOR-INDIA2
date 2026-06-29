const User = require('../modules/user/user.model');

/**
 * Generate a sequential Volunteer ID in the format DISHAXXXXXX (e.g. DISHA000001).
 * @returns {Promise<string>} The next sequential volunteer ID.
 */
const generateVolunteerId = async () => {
  // Find the last user with a volunteer ID matching the DISHA prefix followed by 6 digits
  const lastUser = await User.findOne({ volunteerId: /^DISHA\d{6}$/ })
    .sort({ volunteerId: -1 })
    .select('volunteerId')
    .exec();

  if (!lastUser || !lastUser.volunteerId) {
    return 'DISHA000001';
  }

  // Extract the numeric part, increment it, and pad with leading zeros
  const lastIdNumber = parseInt(lastUser.volunteerId.replace('DISHA', ''), 10);
  const nextIdNumber = lastIdNumber + 1;
  const paddedNumber = nextIdNumber.toString().padStart(6, '0');

  return `DISHA${paddedNumber}`;
};

module.exports = {
  generateVolunteerId,
};
