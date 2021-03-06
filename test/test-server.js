'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

const should = chai.should();

chai.use(chaiHttp);

describe('index.html', () => {

  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  it('should exist', () => {
    return chai.request(app)
      .get('/')
      .then(res => {
        res.should.have.status(200);
        res.should.be.html;
      });
  });
});