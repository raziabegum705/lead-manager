const { STATUSES, SOURCES } = require('../config/constants');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,16}$/;

// Each validator returns an object of { field: message }. Empty object = valid.
const validateLead = (body = {}) => {
  const errors = {};
  const name = String(body.name || '').trim();
  const company = String(body.company || '').trim();

  if (name.length < 2) errors.name = 'Name must be at least 2 characters';
  if (!EMAIL_RE.test(String(body.email || '').trim())) errors.email = 'Enter a valid email address';
  if (!PHONE_RE.test(String(body.phone || '').trim())) errors.phone = 'Enter a valid phone number';
  if (!company) errors.company = 'Company is required';
  if (!SOURCES.includes(body.source)) errors.source = 'Choose a source';
  if (body.status !== undefined && !STATUSES.includes(body.status)) errors.status = 'Invalid status';
  return errors;
};

const validateSignup = (body = {}) => {
  const errors = {};
  if (String(body.name || '').trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!EMAIL_RE.test(String(body.email || '').trim())) errors.email = 'Enter a valid email address';
  if (String(body.password || '').length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

module.exports = { validateLead, validateSignup };
