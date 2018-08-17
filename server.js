"use strict";

const express = require("express");
const mongoose = require("mongoose");
var request = require('request');
var options = {
  url: 'https://api.yelp.com/v3/businesses/search?term=storage+unit&location=san%20diego&start=0&sortby=review_count',
  headers: {
    'Authorization': 'Bearer gxzAI1gpNgnHmS-yFroH633b3LmnU31Uxe8xDxMuxIpM5O9E16zEC1EIUwGD-IAQF1UhI223FGhtixLsiBIUMsNNaTgoczcaRZu9LJ6EEZZYsc1Mpwoafp4dmxB2W3Yx'
  }
};

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const { PORT, DATABASE_URL } = require("./config");

const app = express();

app.use(express.json());
app.use(express.static('public'));

// catch-all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});
 
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
  }
}
 
request(options, callback) {
	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
};



// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}