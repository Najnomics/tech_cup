require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', (err) => {
    console.log('Error in connecting to database');
})

db.on('connected', (err) => {
    console.log('Connected to database');
})

module.exports = db;