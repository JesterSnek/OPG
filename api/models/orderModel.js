const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  plot: {
    type: mongoose.Schema.ObjectId,
    ref: 'Plot',
    required: [true, 'Order must belong to a plot of land!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user!'],
  },
  price: {
    type: Number,
    required: [true, 'Order must have a price.'],
  },
  quantity: {
    type: Number,
    //required: [true, 'Order must have a quantity.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

module.exports = orderSchema;
