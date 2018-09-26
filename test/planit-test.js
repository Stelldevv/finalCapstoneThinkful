'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect;

const { User, Trip } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedUserData() {
  console.info('seeding user data');
  const seededUserData = [];
  for (let i = 1; i <= 10; i++) {
    seededUserData.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.random.word()
    });
  }
  return User.insertMany(seededUserData);
}

function seedTripData() {
  console.info('seeding trip data');
  const seededTripData = [];
  for (let i = 1; i <= 10; i++) {
    seededTripData.push({
      list: [
        faker.internet.userName(),
        faker.internet.userName(),
        faker.internet.userName(),
        faker.internet.userName(),
        faker.internet.userName()
      ],
      username: faker.internet.userName(),
      location: faker.address.city(),
      destination: faker.address.city()
    });
  }
  return Trip.insertMany(seededTripData);
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe('Planit API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedUserData();
  });

  beforeEach(function () {
    return seedTripData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  describe('GET endpoint', function () {

    it('should return a valid Yelp results', function () {

      let res;
      let city = 'Austin';
      let service = 'Barber';

      return chai.request(app)
        .get('/yelp/' + city + '/' + service)
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.include.keys('name', 'rating', 'phone', 'location');
        })
    });

    it('should return all existing users', function () {

      let res;
      return chai.request(app)
        .get('/users')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);
          return User.countDocuments();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
    });

    it('should return users with right fields', function () {

      let resUser;
      return chai.request(app)
        .get('/users')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.lengthOf.at.least(1);

          res.body.forEach(function (user) {
            user.should.be.a('object');
            user.should.include.keys('id', 'username', 'email');
          });
          resUser = res.body[0];
          return User.findById(resUser.id);
        })
        .then(user => {
          resUser.username.should.equal(user.username);
          resUser.email.should.equal(user.email);
        });
    });

    it('should return all existing trips', function () {

      let res;
      return chai.request(app)
        .get('/trips')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);
          return Trip.countDocuments();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
    });

    it('should return trips with right fields', function () {

      let resTrip;
      return chai.request(app)
        .get('/trips')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.lengthOf.at.least(1);

          res.body.forEach(function (trip) {
            trip.should.be.a('object');
            trip.should.include.keys('id', 'list', 'username', 'location', 'destination');
          });
          resTrip = res.body[0];
          return Trip.findById(resTrip.id);
        })
        .then(trip => {
          resTrip.list.should.be.a('array');
          resTrip.list.length.should.equal(trip.list.length);
          resTrip.username.should.equal(trip.username);
          resTrip.location.should.equal(trip.location);
          resTrip.destination.should.equal(trip.destination);
        });
    });
  });

  describe('POST endpoint', function () {

    it('should add a new user', function () {

      const newUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.random.word()
      };

      return chai.request(app)
        .post('/users')
        .send(newUser)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'username', 'email');
          res.body.id.should.not.be.null;
          res.body.username.should.equal(newUser.username);
          res.body.email.should.equal(newUser.email);
          return User.findById(res.body.id);
        })
        .then(function (user) {
          user.username.should.equal(newUser.username);
          user.email.should.equal(newUser.email);
        });
    });

    it('should add a new trip', function () {

      const newTrip = {
        list: [
          faker.internet.userName(),
          faker.internet.userName(),
          faker.internet.userName(),
          faker.internet.userName(),
          faker.internet.userName()
        ],
        username: faker.internet.userName(),
        location: faker.address.city(),
        destination: faker.address.city()
      };

      return chai.request(app)
        .post('/trips')
        .send(newTrip)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'list', 'username', 'location', 'destination');
          res.body.id.should.not.be.null;
          res.body.list.length.should.equal(newTrip.list.length);
          res.body.username.should.equal(newTrip.username);
          res.body.location.should.equal(newTrip.location);
          res.body.destination.should.equal(newTrip.destination);
          return Trip.findById(res.body.id);
        })
        .then(function (trip) {
          trip.list.length.should.equal(newTrip.list.length);
          trip.username.should.equal(newTrip.username);
          trip.location.should.equal(newTrip.location);
          trip.destination.should.equal(newTrip.destination);
        });
    });

  });

  describe('PUT endpoint', function () {

    it('should update user fields you send over', function () {

      const updateData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.random.word()
      };

      return User
        .findOne()
        .then(user => {
          updateData.id = user.id;

          return chai.request(app)
            .put(`/users/${user.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(200);
          return User.findById(updateData.id);
        })
        .then(user => {
          user.username.should.equal(updateData.username);
          user.email.should.equal(updateData.email);
        });
    });

    it('should update trip fields you send over', function () {

      const updateData = {
        list: [
          faker.internet.userName(),
          faker.internet.userName(),
          faker.internet.userName(),
          faker.internet.userName(),
          faker.internet.userName()
        ],
        username: faker.internet.userName(),
        location: faker.address.city(),
        destination: faker.address.city()
      };

      return Trip
        .findOne()
        .then(trip => {
          updateData.id = trip.id;

          return chai.request(app)
            .put(`/trips/${trip.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(200);
          return Trip.findById(updateData.id);
        })
        .then(trip => {
          trip.list.length.should.equal(updateData.list.length);
          trip.username.should.equal(updateData.username);
          trip.location.should.equal(updateData.location);
          trip.destination.should.equal(updateData.destination);
        });
    });
  });

  describe('DELETE endpoint', function () {

    it('should delete a user by id', function () {

      let user;

      return User
        .findOne()
        .then(_user => {
          user = _user;
          return chai.request(app).delete(`/users/${user.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return User.findById(user.id);
        })
        .then(_user => {
          should.not.exist(_user);
        });
    });

    it('should delete a trip by id', function () {

      let trip;

      return Trip
        .findOne()
        .then(_trip => {
          trip = _trip;
          return chai.request(app).delete(`/trips/${trip.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Trip.findById(trip.id);
        })
        .then(_trip => {
          should.not.exist(_trip);
        });
    });
  });
});