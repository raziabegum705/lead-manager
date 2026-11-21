const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validateSignup } = require('../utils/validators');

const send = (res, status, user) =>
  res.status(status).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });

exports.signup = async (req, res) => {
  const errors = validateSignup(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields', errors });

  const email = req.body.email.trim().toLowerCase();
  if (await User.findOne({ email })) {
    return res.status(409).json({ message: 'An account with this email already exists', errors: { email: 'Already registered' } });
  }

  const password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ name: req.body.name.trim(), email, password });
  send(res, 201, user);
};

exports.login = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const user = await User.findOne({ email }).select('+password');
  const ok = user && (await bcrypt.compare(String(req.body.password || ''), user.password));
  if (!ok) return res.status(401).json({ message: 'Incorrect email or password' });
  send(res, 200, user);
};

exports.me = (req, res) =>
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
