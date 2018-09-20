'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const { User, Trip } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

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

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  describe('GET endpoint', function () {

    it('should return HTML', function () {
      let res;
      return chai.request(app)
        .get('https://calm-hollows-72370.herokuapp.com/')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
        })
      });
    });
  });