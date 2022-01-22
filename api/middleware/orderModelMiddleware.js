const mongoose = require('mongoose');
const orderSchema = require('../models/orderModel');

orderSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'plot',
    select: 'name imageCover slug',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
