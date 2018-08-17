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

var listSchema = mongoose.Schema({ content: [] });



//blogPostSchema.methods.serialize = function() {
  //return {
    //id: this._id,
    //author: this.authorName,
    //content: this.content,
    //title: this.title,
    //comments: this.comments
  //};
//};

var userData = mongoose.model('User', userSchema);
var listData = mongoose.model('List', listSchema);

module.exports = {User, List};