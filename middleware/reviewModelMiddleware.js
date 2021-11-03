const mongoose = require('mongoose');
const reviewSchema = require('../models/reviewModel');

//Populating the review with the plot and user data
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
