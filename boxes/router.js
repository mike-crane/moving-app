'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Box } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();


module.exports = { router };