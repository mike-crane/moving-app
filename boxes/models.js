'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const BoxSchema = mongoose.Schema({
  user: { type: String },
  room: { type: String, required: true },
  description: { type: String, required: true },
  contents: { type: String, required: true },
  unpacked: { type: Boolean, default: false }
});

BoxSchema.methods.serialize = function () {
  return {
    user: this.user,
    room: this.room,
    description: this.description,
    contents: this.contents,
    id: this._id,
    unpacked: this.unpacked
  };
};

const Box = mongoose.model('Box', BoxSchema);

module.exports = { Box };