'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

const should = chai.should();

chai.use(chaiHttp);

describe('index.html', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/')
      .then(res => {
        res.should.have.status(200);
        res.should.be.html;
      });
  });
});