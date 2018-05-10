const mongoose = require('mongoose');

const boxes = mongoose.Schema({
  user: { type: String, required: true },
  room: { type: String, required: true },
  description: { type: String },
  contents: { type: String },
  packed: { type: Date, default: Date.now },
  unpacked: { type: Boolean, default: false }
});

boxSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    user: this.user,
    room: this.room,
    description: this.description,
    contents: this.contents,
    packed: this.packed,
    unpacked: this.unpacked
  };
}

const Boxes = mongoose.model('boxes', boxSchema);

module.exports = { Boxes };

// let room = "kitchen"
// Boxes.find({room: ${room} })
//   .then(boxes)