const mongoose = require('mongoose'); //import mongoose to connect with database

const dbURI = process.env.DB_URL; 

mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected')) //connect to database
    .catch(err => console.error(err)); //

module.exports = mongoose;
