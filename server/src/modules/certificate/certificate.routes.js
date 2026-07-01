const express = require('express');
const certificateController = require('./certificate.controller');
const {
  validateGetCertificates,
  validateGetCertificate,
  validateVerifyCertificate,
} = require('./certificate.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

// ─── Public Route ──────────────────────────────────────────────────
// Certificate verification is public to allow employers/institutions to verify
router.get(
  '/verify/:certificateNumber',
  validateVerifyCertificate,
  certificateController.verifyCertificate
);

// ─── Protected Routes ─────────────────────────────────────────────
router.use(authenticate);

router.get('/', validateGetCertificates, certificateController.getMyCertificates);
router.get('/:id', validateGetCertificate, certificateController.getCertificate);

module.exports = router;
