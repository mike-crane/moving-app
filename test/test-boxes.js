'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { Box } = require('../boxes');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/box', () => {
  const room = 'exampleRoom';
  const description = 'exampleDesc';
  const contents = 'exampleCont';

  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  beforeEach(() => { });

  afterEach(() => {
    return Box.remove({});
  });

  describe('/api/boxes', () => {
    describe('POST', () => {
      it('Should reject boxes with missing room', () => {
        return chai
          .request(app)
          .post('/api/boxes')
          .send({
            description,
            contents
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('room');
          });
      });
      it('Should reject boxes with missing description', () => {
        return chai
          .request(app)
          .post('/api/boxes')
          .send({
            room,
            contents
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('description');
          });
      });
      it('Should reject boxes with missing contents', () => {
        return chai
          .request(app)
          .post('/api/boxes')
          .send({
            room,
            description
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('contents');
          });
      });
      it('Should reject users with empty room', () => {
        return chai
          .request(app)
          .post('/api/boxes')
          .send({
            room: '',
            description,
            contents
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('room');
          });
      });
      it('Should reject users with empty description', () => {
        return chai
          .request(app)
          .post('/api/boxes')
          .send({
            room,
            description: '',
            contents
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('description');
          });
      });
      it('Should reject users with empty contents', () => {
        return chai
          .request(app)
          .post('/api/boxes')
          .send({
            room,
            description,
            contents: ''
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('contents');
          });
      });
      describe('GET', () => {
        it('Should return an empty array initially', () => {
          return chai.request(app).get('/api/boxes').then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          });
        });
        it('Should return an array of boxes', () => {
          return Box.create(
            {
              room: 'roomA',
              description: 'descriptionA',
              contents: 'contentsA'
            },
            {
              room: 'roomB',
              description: 'descriptionB',
              contents: 'contentsB'
            }
          )
            .then(() => chai.request(app).get('/api/boxes'))
            .then(res => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.length(2);
              expect(res.body[0]).to.deep.equal({
                room: 'roomA',
                description: 'descriptionA',
                contents: 'contentsA'
              });
              expect(res.body[1]).to.deep.equal({
                room: 'roomB',
                description: 'descriptionB',
                contents: 'contentsB'
              });
            });
        });
      });
    });
  });
});
