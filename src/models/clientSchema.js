// clientSchema.js
const mongoose = require('mongoose');
const Counter = require('./counterSchema');

const clientSchema = new mongoose.Schema({
  _id: {
    type: Number,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: false,
  }

});

const DeletedIdSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    unique: true
  }
});

const DeletedId = mongoose.model('DeletedId', DeletedIdSchema);

clientSchema.pre('save', async function (next) {
  if (this.isNew) {
    const deletedId = await DeletedId.findOne().sort({ _id: 1 });

    if (deletedId) {
      this._id = deletedId._id;
      await DeletedId.deleteOne({ _id: deletedId._id });
    } else {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'clientId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this._id = counter.seq;
    }
  }
  next();
});

module.exports = mongoose.model('Client', clientSchema);
