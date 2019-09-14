// Load env setting
require('dotenv').config();
// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var app = express();
var PORT = process.env.SERVER_PORT;

// Use ES6 native Promise
mongoose.Promise = global.Promise

// Connect to Mongodb server
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Successfully connected to mongodb.'))
    .catch(e => console.error(e));

// Static File Service
app.use(express.static('public'));
// Body-parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Set the secret key for jwt
app.set('jwt-secret', process.env.JWT_SECRET)

// Routing
app.use('/api', require('./routes/api'));

var server = app.listen(PORT, function() {
    console.log(`Server listening on ${PORT}`);
});