const mongoose = require('mongoose'); //import mongoose to connect with database
require('dotenv').config();

// Use the correct database URL based on the environment
const dbURI = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;