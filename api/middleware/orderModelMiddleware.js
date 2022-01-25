const mongoose = require('mongoose');
const orderSchema = require('../models/orderModel');

orderSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'plot',
    select: 'name imageCover slug product',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
