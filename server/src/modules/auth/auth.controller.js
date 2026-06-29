const authService = require('./auth.service');
const { successResponse } = require('../../utils/response');

class AuthController {
  register = async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, 201, 'Register endpoint (Skeleton)', result);
    } catch (error) {
      return next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      return successResponse(res, 200, 'Login endpoint (Skeleton)', result);
    } catch (error) {
      return next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const result = await authService.logout(userId);
      return successResponse(res, 200, 'Logout endpoint (Skeleton)', result);
    } catch (error) {
      return next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken || req.body.refreshToken;
      const result = await authService.refreshToken(token);
      return successResponse(res, 200, 'Refresh token endpoint (Skeleton)', result);
    } catch (error) {
      return next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return successResponse(res, 200, 'Forgot password endpoint (Skeleton)', result);
    } catch (error) {
      return next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const result = await authService.resetPassword(token, password);
      return successResponse(res, 200, 'Reset password endpoint (Skeleton)', result);
    } catch (error) {
      return next(error);
    }
  };

  googleLogin = async (req, res, next) => {
    try {
      const { token } = req.body;
      const result = await authService.googleLogin(token);
      return successResponse(res, 200, 'Google login endpoint (Skeleton)', result);
    } catch (error) {
      return next(error);
    }
  };

  getCurrentUser = async (req, res, next) => {
    try {
      return successResponse(res, 200, 'Get current user endpoint (Skeleton)', {
        user: req.user || null,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AuthController();
