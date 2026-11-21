const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const { validateLead } = require('../utils/validators');
const { STATUSES, SORT_FIELDS } = require('../config/constants');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pick = (b) => ({
  name: b.name?.trim(),
  email: b.email?.trim(),
  phone: b.phone?.trim(),
  company: b.company?.trim(),
  source: b.source,
  status: b.status,
});

// GET /api/leads?search=&status=&sort=&order=&page=&limit=
exports.getLeads = async (req, res) => {
  const { search = '', status, sort = 'createdAt', order = 'desc' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const filter = { user: req.user._id };
  if (STATUSES.includes(status)) filter.status = status;
  if (search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }];
  }

  const sortField = SORT_FIELDS.includes(sort) ? sort : 'createdAt';
  const sortDir = order === 'asc' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ [sortField]: sortDir, _id: -1 }).skip((page - 1) * limit).limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.json({ leads, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
};

// GET /api/leads/stats -> counts per status
exports.getStats = async (req, res) => {
  const rows = await Lead.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const stats = { total: 0, New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
  rows.forEach((r) => {
    stats[r._id] = r.count;
    stats.total += r.count;
  });
  res.json(stats);
};

exports.createLead = async (req, res) => {
  const errors = validateLead(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields', errors });

  const lead = await Lead.create({ ...pick(req.body), user: req.user._id });
  res.status(201).json(lead);
};

exports.updateLead = async (req, res) => {
  const errors = validateLead(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields', errors });

  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    pick(req.body),
    { new: true, runValidators: true }
  );
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json(lead);
};

exports.deleteLead = async (req, res) => {
  const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json({ message: 'Lead deleted', id: lead._id });
};
