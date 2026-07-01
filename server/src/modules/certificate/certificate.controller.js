const certificateService = require('./certificate.service');
const { MESSAGES } = require('./certificate.constants');
const { successResponse } = require('../../utils/response');

class CertificateController {
  /**
   * GET /api/v1/certificates
   * List all certificates for the logged-in volunteer.
   */
  getMyCertificates = async (req, res, next) => {
    try {
      const result = await certificateService.getMyCertificates(req.user.id, req.query);
      return successResponse(res, 200, MESSAGES.CERTIFICATES_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/certificates/:id
   * Get a single certificate by MongoDB ID.
   */
  getCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.getCertificate(req.params.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/certificates/verify/:certificateNumber
   * Verify a certificate by its unique certificate number (public route).
   */
  verifyCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.verifyCertificate(req.params.certificateNumber);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_VERIFIED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new CertificateController();
