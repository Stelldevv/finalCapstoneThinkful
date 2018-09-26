'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
  username: {
    type: 'string',
    unique: true
  },
  email: {
    type: 'string',
    unique: true
  },
  password: 'string'
});

var tripSchema = mongoose.Schema({
  list: 'array',
  username: 'string',
  location: 'string',
  destination: 'string'
});

var User = mongoose.model('User', userSchema);
var Trip = mongoose.model('Trip', tripSchema);

module.exports = {User, Trip};