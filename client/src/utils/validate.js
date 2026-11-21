const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,16}$/;

export const validateLead = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (!PHONE_RE.test(f.phone.trim())) e.phone = 'Enter a valid phone number';
  if (!f.company.trim()) e.company = 'Company is required';
  if (!f.source) e.source = 'Choose a source';
  return e;
};

export const validateAuth = (f, isSignup) => {
  const e = {};
  if (isSignup && f.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (f.password.length < 6) e.password = 'Password must be at least 6 characters';
  return e;
};

// Turns any failed request into a readable message
export const errorMessage = (err) =>
  err.response?.data?.message || (err.request ? 'Cannot reach the server. Check your connection and try again.' : 'Something went wrong.');
