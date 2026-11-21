const mongoose = require('mongoose');
const { STATUSES, SOURCES } = require('../config/constants');

const leadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    source: { type: String, enum: SOURCES, required: true },
    status: { type: String, enum: STATUSES, default: 'New' },
  },
  { timestamps: true }
);

// Each user sees only their own leads; one lead per email per user.
leadSchema.index({ user: 1, email: 1 }, { unique: true });
// Speeds up the status filter + default "newest first" ordering.
leadSchema.index({ user: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
