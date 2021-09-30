const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A plot must have a name.'], //validator
    unique: true,
  },
  description: String,
  size: {
    type: Number,
    required: [true, 'Plot size is required.'],
  },
});

const Plot = mongoose.model('Plot', plotSchema);

module.exports = Plot;
