const { COOKIE_OPTIONS } = require('../modules/auth/auth.constants');

const COOKIE_OPTIONS_ACCESS = {
  httpOnly: COOKIE_OPTIONS.httpOnly,
  secure: COOKIE_OPTIONS.secure,
  sameSite: COOKIE_OPTIONS.sameSite,
  maxAge: 15 * 60 * 1000, // 15 minutes (matches access token expiry)
};

/**
 * Set the refresh token inside a secure HTTP-only cookie.
 * @param {object} res - Express response object.
 * @param {string} refreshToken - The JWT refresh token.
 */
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
};

/**
 * Set the access token inside a secure HTTP-only cookie.
 * @param {object} res - Express response object.
 * @param {string} accessToken - The JWT access token.
 */
const setAccessTokenCookie = (res, accessToken) => {
  res.cookie('accessToken', accessToken, COOKIE_OPTIONS_ACCESS);
};

/**
 * Clear the refresh token cookie.
 * @param {object} res - Express response object.
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
  });
};

/**
 * Clear the access token cookie.
 * @param {object} res - Express response object.
 */
const clearAccessTokenCookie = (res) => {
  res.clearCookie('accessToken', {
    httpOnly: COOKIE_OPTIONS_ACCESS.httpOnly,
    secure: COOKIE_OPTIONS_ACCESS.secure,
    sameSite: COOKIE_OPTIONS_ACCESS.sameSite,
  });
};

/**
 * Clear all auth cookies.
 * @param {object} res - Express response object.
 */
const clearAllAuthCookies = (res) => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
};

module.exports = {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  clearRefreshTokenCookie,
  clearAccessTokenCookie,
  clearAllAuthCookies,
};
