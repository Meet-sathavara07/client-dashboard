const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    clientIds: [{
      type: mongoose.Schema.Types.String,
      ref: 'Client'
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

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
