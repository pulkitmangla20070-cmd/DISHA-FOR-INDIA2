const analyticsService = require('./analytics.service');
const { MESSAGES, MESSAGES_DASHBOARD } = require('./analytics.constants');
const { successResponse } = require('../../utils/response');

class AnalyticsController {
  /**
   * GET /api/v1/analytics/dashboard/volunteer
   * Get volunteer dashboard statistics
   */
  getVolunteerDashboard = async (req, res, next) => {
    try {
      const result = await analyticsService.getVolunteerDashboard(req.user.id);
      return successResponse(res, 200, MESSAGES_DASHBOARD.VOLUNTEER_DASHBOARD_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/analytics/dashboard/admin
   * Get admin dashboard statistics
   */
  getAdminDashboard = async (req, res, next) => {
    try {
      const result = await analyticsService.getAdminDashboard();
      return successResponse(res, 200, MESSAGES_DASHBOARD.ADMIN_DASHBOARD_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/analytics/dashboard/super-admin
   * Get super admin dashboard statistics
   */
  getSuperAdminDashboard = async (req, res, next) => {
    try {
      const result = await analyticsService.getSuperAdminDashboard();
      return successResponse(res, 200, MESSAGES_DASHBOARD.SUPER_ADMIN_DASHBOARD_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ============================================================
  // VOLUNTEER ANALYTICS
  // ============================================================

  /**
   * GET /api/v1/analytics/volunteers
   * Get volunteer analytics report
   */
  getVolunteerAnalytics = async (req, res, next) => {
    try {
      const { dateRange } = req.query;
      const result = await analyticsService.getVolunteerAnalytics(dateRange);
      return successResponse(res, 200, MESSAGES.VOLUNTEER_ANALYTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ============================================================
  // PROGRAM ANALYTICS
  // ============================================================

  /**
   * GET /api/v1/analytics/programs
   * Get program analytics report
   */
  getProgramAnalytics = async (req, res, next) => {
    try {
      const { dateRange } = req.query;
      const result = await analyticsService.getProgramAnalytics(dateRange);
      return successResponse(res, 200, MESSAGES.PROGRAM_ANALYTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ============================================================
  // APPLICATION ANALYTICS
  // ============================================================

  /**
   * GET /api/v1/analytics/applications
   * Get application analytics report
   */
  getApplicationAnalytics = async (req, res, next) => {
    try {
      const { dateRange } = req.query;
      const result = await analyticsService.getApplicationAnalytics(dateRange);
      return successResponse(res, 200, MESSAGES.APPLICATION_ANALYTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ============================================================
  // ATTENDANCE ANALYTICS
  // ============================================================

  /**
   * GET /api/v1/analytics/attendance
   * Get attendance analytics report
   */
  getAttendanceAnalytics = async (req, res, next) => {
    try {
      const { dateRange } = req.query;
      const result = await analyticsService.getAttendanceAnalytics(dateRange);
      return successResponse(res, 200, MESSAGES.ATTENDANCE_ANALYTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ============================================================
  // CERTIFICATE ANALYTICS
  // ============================================================

  /**
   * GET /api/v1/analytics/certificates
   * Get certificate analytics report
   */
  getCertificateAnalytics = async (req, res, next) => {
    try {
      const { dateRange } = req.query;
      const result = await analyticsService.getCertificateAnalytics(dateRange);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_ANALYTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ============================================================
  // REWARD ANALYTICS
  // ============================================================

  /**
   * GET /api/v1/analytics/rewards
   * Get reward analytics report
   */
  getRewardAnalytics = async (req, res, next) => {
    try {
      const { dateRange } = req.query;
      const result = await analyticsService.getRewardAnalytics(dateRange);
      return successResponse(res, 200, MESSAGES.REWARD_ANALYTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ============================================================
  // LEADERBOARD ANALYTICS
  // ============================================================

  /**
   * GET /api/v1/analytics/leaderboard
   * Get leaderboard analytics report
   */
  getLeaderboardAnalytics = async (req, res, next) => {
    try {
      const { limit = 10 } = req.query;
      const result = await analyticsService.getLeaderboardAnalytics(parseInt(limit, 10));
      return successResponse(res, 200, MESSAGES.LEADERBOARD_ANALYTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  // ============================================================
  // ORGANIZATION ANALYTICS
  // ============================================================

  /**
   * GET /api/v1/analytics/organizations
   * Get organization analytics report
   */
  getOrganizationAnalytics = async (req, res, next) => {
    try {
      const { dateRange } = req.query;
      const result = await analyticsService.getOrganizationAnalytics(dateRange);
      return successResponse(res, 200, MESSAGES.ORGANIZATION_ANALYTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AnalyticsController();