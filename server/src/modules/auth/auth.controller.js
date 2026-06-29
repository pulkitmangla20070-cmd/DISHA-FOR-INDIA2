const authService = require('./auth.service');
const { MESSAGES } = require('./auth.constants');
const { successResponse } = require('../../utils/response');

class AuthController {
  register = async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      return successResponse(res, 201, MESSAGES.REGISTER_SUCCESS, { user });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const user = await authService.login(req.body);
      return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, { user });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AuthController();
