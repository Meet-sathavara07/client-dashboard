const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const clientSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Client', clientSchema);
