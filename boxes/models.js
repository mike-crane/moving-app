'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const BoxSchema = mongoose.Schema({
  // user: { type: String, required: true },
  room: { type: String, required: true },
  description: { type: String, required: true },
  contents: { type: String, required: true }
  // packed: { type: Date, default: Date.now },
  // unpacked: { type: Boolean, default: false }
});

BoxSchema.methods.serialize = function () {
  return {
    // id: this._id,
    // user: this.user,
    room: this.room,
    description: this.description,
    contents: this.contents
    // packed: this.packed,
    // unpacked: this.unpacked
  };
};

const Box = mongoose.model('Box', BoxSchema);

module.exports = { Box };

// let room = "kitchen"
// Box.find({room: ${room} })
//   .then(BoxSchema)