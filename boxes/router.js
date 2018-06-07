'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const { Box } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jsonParser)

// Get all boxes
router.get('/:user', jwtAuth, (req, res) => {
  return Box.find({user: req.params.user})
    .then(boxes => res.status(200).json(boxes.map(box => box.serialize())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
  
});

// Post new box
router.post('/', jwtAuth, (req, res) => {

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

  return Box.create(req.body)
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


// Update box with a given id
router.put('/:id', jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ['room', 'description', 'contents', 'id'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  Box.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    .then(box => res.status(204).json(box));
});


// Delete a box with a given id
router.delete('/:id', jwtAuth, (req, res) => {

  return Box
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.use('*', (req, res) => {
  res.status(404).send('URL Not Found');
});

module.exports = { router };