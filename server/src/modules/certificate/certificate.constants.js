const CERTIFICATE_STATUS = {
  ISSUED: 'issued',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
};

const MESSAGES = {
  CERTIFICATE_GENERATED: 'Certificate generated successfully',
  CERTIFICATE_FETCHED: 'Certificate retrieved successfully',
  CERTIFICATES_FETCHED: 'Certificates retrieved successfully',
  CERTIFICATE_REVOKED: 'Certificate revoked successfully',
  CERTIFICATE_VERIFIED: 'Certificate verified successfully',
  CERTIFICATE_INVALID: 'Certificate is invalid or does not exist',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const VALIDATION = {
  CERTIFICATE_NUMBER_PREFIX: 'DISHA-CERT',
};

module.exports = {
  CERTIFICATE_STATUS,
  MESSAGES,
  PAGINATION,
  VALIDATION,
};
