"use strict";

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
var request = require('request');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { User, Trip } = require('./models');

const app = express();

app.use(express.json());
app.use(morgan("common"));
app.use(express.static('public'));

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    var yelpReturn = info.businesses[0];
    console.log(yelpReturn);
    return yelpReturn;
  }
}

app.get('/login/:username/:password', (req, res) => {
	var status;
  User
    .findOne({ username: req.params.username })
    .then(user => {
      if (user.password == req.params.password) {
        status = "Success";
        const message = `Login ` + status + " - " + req.params.username;
        console.log(message);
        res.json(status);
      } else {
      	status = "Failure";
      	const message = `Login ` + status + " - " + req.params.username;
      	console.log(message);
      	res.json(status);
      }
  })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/trips', (req, res) => {
  Trip
    .find()
    .then(trips => {
      res.status(200).json(trips.map(trip => {
        return {
          id: trip.id,
          list: trip.list,
          username: trip.username,
          location: trip.location,
          destination: trip.destination
        };
      }));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/trips/:username', (req, res) => {
  Trip
    .findOne({ username: req.params.username })
    .then(tripData => {
      if (tripData == null) {
      	console.log("No Trips found.");
      	res.json('not found')
      } else {
      	console.log("Trip contains " + tripData);
      	res.status(200).json(tripData);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.post('/trips', (req, res) => {
	const requiredFields = ['list', 'username', 'location', 'destination'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });

  Trip
  	.create({
       list: req.body.list,
       username: req.body.username,
       location: req.body.location,
       destination: req.body.destination
    })
    .then(trip => res.status(201).json({
       id: trip.id,
       list: trip.list,
       username: trip.username,
       location: trip.location,
       destination: trip.destination
    }))
    .catch(err => {
       console.error(err);
       res.status(500).json({ error: 'Something went wrong' });
    });
})

app.put('/trips/:id', (req, res) => {
  if (!(req.params.id && req.body.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = {};
  const updateableFields = ['list', 'username', 'location', 'destination'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Trip
    .findOne({ list: updated.list || '', _id: { $ne: req.params.id } })
    .then(() => {
        Trip
          .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
          .then(updatedTrip => {
            res.status(200).json({
              id: updatedTrip.id,
              list: updatedTrip.list,
              username: updatedTrip.username,
              location: updatedTrip.location,
              destination: updatedTrip.destination
            });
          })
          .catch(err => res.status(500).json({ message: err }));
    });
});

app.delete('/trips/:id', (req, res) => {
  Trip
    .remove({ trip: req.params.id })
    .then(() => {
      Trip
        .findByIdAndRemove(req.params.id)
        .then(() => {
          console.log(`Deleted trip owned by user with id \`${req.params.id}\``);
          res.status(204).json({ message: 'success' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/yelp/:city/:service', (req, res) => {
	var options = {
  		url: 'https://api.yelp.com/v3/businesses/search?{service}&{location}&sortby=review_count',
  		headers: {
    		'Authorization': 'Bearer gxzAI1gpNgnHmS-yFroH633b3LmnU31Uxe8xDxMuxIpM5O9E16zEC1EIUwGD-IAQF1UhI223FGhtixLsiBIUMsNNaTgoczcaRZu9LJ6EEZZYsc1Mpwoafp4dmxB2W3Yx'
  		}
	}
		let city = "location=".concat(req.params.city);
		let service = "term=".concat(req.params.service);
		options.url = options.url.replace("{service}&{location}", service + '&' + city);
		request.get(options, (error, body, response) => {
      if (JSON.parse(body.body).businesses !== undefined){
        res.status(200).json(JSON.parse(body.body).businesses[0]);
      } else {
        res.status(200).json("Result not found");
      }
	})
    .catch(function () {
      console.log("Promise Rejected");
    });
})

app.get('/users', (req, res) => {
  User
    .find()
    .then(users => {
      res.status(200).json(users.map(user => {
        return {
          id: user.id,
          username: user.username,
          email: user.email
        };
      }));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.post('/users', (req, res) => {
  const requiredFields = ['username', 'email', 'password'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      res.status(400).send(message);
    }
  });

  User
    .findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        const message = `Username already taken`;
        console.error(message);
        res.status(400).send(message);
      }
      else {
        User
          .create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          })
          .then(user => res.status(201).json({
              id: user.id,
              username: user.username,
              email: user.email
            }))
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

app.put('/users/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['username', 'email', 'password'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  User
    .findOne({ username: updated.username || '', _id: { $ne: req.params.id } })
    .then(user => {
      if(user) {
        const message = `Username already taken`;
        console.error(message);
        return res.status(400).send(message);
      }
      else {
        User
          .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
          .then(updatedUser => {
            res.status(200).json({
              id: updatedUser.id,
              username: updatedUser.username,
              email: updatedUser.email
            });
          })
          .catch(err => res.status(500).json({ message: err }));
      }
    });
});

app.delete('/users/:id', (req, res) => {
  User
    .remove({ user: req.params.id })
    .then(() => {
      User
        .findByIdAndRemove(req.params.id)
        .then(() => {
          console.log(`Deleted lists owned by and user with id \`${req.params.id}\``);
          res.status(204).json({ message: 'success' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });  
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };