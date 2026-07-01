const mongoose = require('mongoose');
const { CERTIFICATE_STATUS } = require('./certificate.constants');

const certificateSchema = new mongoose.Schema(
  {
    // ─── Identification ──────────────────────────────────────────────
    certificateId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    certificateNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      // Example: DISHA-CERT-2026-000001
    },

    // ─── Relationships ───────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program reference is required'],
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },
    attendance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
      default: null,
    },

    // ─── Certificate Details ─────────────────────────────────────────
    certificateUrl: {
      type: String,
      trim: true,
      default: null,
    },
    verificationUrl: {
      type: String,
      trim: true,
      default: null,
    },
    qrCode: {
      type: String,
      trim: true,
      default: null,
    },

    // ─── Status ──────────────────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(CERTIFICATE_STATUS),
      default: CERTIFICATE_STATUS.ISSUED,
      index: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ─── Soft Delete ─────────────────────────────────────────────────
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ certificateNumber: 1 }, { unique: true });
certificateSchema.index({ user: 1, program: 1 });
certificateSchema.index({ issuedAt: -1 });

certificateSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
