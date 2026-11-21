require('express-async-errors');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/leads', require('./routes/lead.routes'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Central error handler: Express 4 doesn't catch async errors, so we wrap below.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' });
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A lead with this email already exists', errors: { email: 'Already exists' } });
  }
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our side. Please try again.' });
});

module.exports = app;
