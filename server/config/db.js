const mongoose = require('mongoose');

const connectDB = async (uri = process.env.MONGODB_URI) => {
  if (!uri) throw new Error('MONGODB_URI is not set. Copy .env.example to .env first.');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
