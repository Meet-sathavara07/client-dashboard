// models/caPostSchema.js
const mongoose = require('mongoose');

const caPostSchema = new mongoose.Schema({
  clientIds: [{
    type: mongoose.Schema.Types.String,
    ref: 'Client',
  }],
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sentDate: {
    type: Date,
    default: Date.now,
  },
});

const CaPost = mongoose.model('CaPost', caPostSchema);

module.exports = CaPost;
