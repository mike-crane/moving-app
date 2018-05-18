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

// Post to add new box
router.post('/', jsonParser, (req, res) => {

  const requiredFields = ['room', 'contents'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  let { room, contents, description } = req.body;

  return Box.create({
    room,
    description,
    contents
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

module.exports = { router };