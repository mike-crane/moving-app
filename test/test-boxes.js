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
            expect(res.body[0].room).to.equal('roomA');
            expect(res.body[0].description).to.equal('descriptionA');
            expect(res.body[0].contents).to.equal('contentsA');
            expect(res.body[1].room).to.equal('roomB');
            expect(res.body[1].description).to.equal('descriptionB');
            expect(res.body[1].contents).to.equal('contentsB');
          });
      });
    });
    describe('POST', () => {
      it('Should return a newly created box', () => {
        return chai
          .request(app)
          .post('/api/boxes')
          .send({ room, description, contents })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            const room = res.body.room;
            const description = res.body.description;
            const contents = res.body.contents;
            expect(room).to.be.a('string');
            expect(description).to.be.a('string');
            expect(contents).to.be.a('string');
            expect(room).to.equal('exampleRoom');
            expect(description).to.equal('exampleDesc');
            expect(contents).to.equal('exampleCont');
          });
      });
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
      it('Should reject boxes with empty room', () => {
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
      it('Should reject boxes with empty description', () => {
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
      it('Should reject boxes with empty contents', () => {
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
    });

    // describe('DELETE', () => {
    //   it('Should delete box with the supplied id', () => {
    //     let box;

    //     return Box
    //       .findOne()
    //       .then((_box) => {
    //         box = _box;
    //         return chai.request(app).delete(`/boxes/${box.id}`);
    //       })
    //       .then((res) => {
    //         expect(res).to.have.status(204);
    //         return Box.findById(box.id);
    //       })
    //       .then((_box) => {
    //         expect(_box).to.be.null;
    //       });
    //   });
    // });
  });
});