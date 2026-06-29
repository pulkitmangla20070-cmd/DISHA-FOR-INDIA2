const authRepository = require('./auth.repository');
const { MESSAGES } = require('./auth.constants');
const { STATUS, ROLES } = require('../user/user.constants');
const { ConflictError, AuthenticationError } = require('../../utils/errors');
const passwordUtils = require('../../utils/password');
const { generateVolunteerId } = require('../../utils/volunteerId');

class AuthService {
  /**
   * Register a new user.
   * @param {object} userData - Registration details.
   * @returns {Promise<object>} The created user.
   */
  async register(userData) {
    const { name, username, email, password, phone } = userData;

    // Check if email already exists
    const existingEmail = await authRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictError(MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Check if username already exists
    const existingUsername = await authRepository.findByUsername(username);
    if (existingUsername) {
      throw new ConflictError(MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    // Generate sequential Volunteer ID
    const volunteerId = await generateVolunteerId();

    // Hash the password
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Create the user in the database
    const user = await authRepository.create({
      volunteerId,
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      role: ROLES.VOLUNTEER,
      status: STATUS.PENDING,
    });

    return user;
  }

  /**
   * Log in an existing user.
   * @param {object} credentials - Login credentials (email or username, and password).
   * @returns {Promise<object>} The logged-in user.
   */
  async login(credentials) {
    const { email, username, password } = credentials;
    let user = null;

    // Find user by email or username
    if (email) {
      user = await authRepository.findByEmail(email);
    } else if (username) {
      user = await authRepository.findByUsername(username);
    }

    if (!user) {
      throw new AuthenticationError(MESSAGES.INVALID_CREDENTIALS);
    }

    // Compare passwords
    const isPasswordMatch = await passwordUtils.comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw new AuthenticationError(MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify account status (Blocked/Suspended users cannot log in)
    if (user.status === STATUS.SUSPENDED) {
      throw new AuthenticationError('Your account has been suspended. Please contact support.');
    }

    // Update login information
    const updatedUser = await authRepository.update(user._id, {
      lastLogin: new Date(),
      lastActive: new Date(),
    });

    return updatedUser;
  }
}

module.exports = new AuthService();
