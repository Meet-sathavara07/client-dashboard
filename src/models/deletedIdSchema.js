// deletedIdSchema.js
const mongoose = require('mongoose');

const deletedIdSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('DeletedId', deletedIdSchema);
