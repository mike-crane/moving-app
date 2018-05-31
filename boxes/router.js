'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Box } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Get all boxes
router.get('/', (req, res) => {
  return Box.find()
    .then(boxes => res.status(200).json(boxes.map(box => box.serialize())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
  
});
// 'use strict';
// const express = require('express');
// const bodyParser = require('body-parser');
// const passport = require('passport');

// const { Box } = require('./models');

// const router = express.Router();

// const jsonParser = bodyParser.json();

// const jwtAuth = passport.authenticate('jwt', { session: false });

// // Get all boxes
// router.get('/', jwtAuth, (req, res) => {
//   const username = req.user;

//   return Box.find({ username })
//     .then(boxes => res.status(200).json(boxes.map(box => box.serialize())))
//     .catch(err => res.status(500).json({ message: 'Internal server error' }));

// });

// Post to add new box
router.post('/', jsonParser, (req, res) => {

  const requiredFields = ['room', 'description', 'contents'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const sizedFields = {
    room: {
      min: 1
    },
    description: {
      min: 1
    },
    contents: {
      min: 1
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { room, contents, description, id } = req.body;

  return Box.create({
    room,
    description,
    contents,
    id
  })
    .then(box => {
      return res.status(201).json(box.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

// endpoint that allows you to delete a box with a given id
router.delete('/:id', (req, res) => {

  return Box
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.use('*', (req, res) => {
  res.status(404).send('URL Not Found');
});

module.exports = { router };