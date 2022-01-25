const mongoose = require('mongoose');
const reviewSchema = require('../models/reviewModel');
const Plot = require('./plotModelMiddleware');

//Populating the review with the plot and user data
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (plotId) {
  const stats = await this.aggregate([
    {
      $match: { plot: plotId },
    },
    {
      $group: {
        _id: '$plot',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  //console.log(stats);
  if (stats.length > 0) {
    await Plot.findByIdAndUpdate(plotId, {
      ratingsQuantity: stats[0].numRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Plot.findByIdAndUpdate(plotId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
// Works on save and create
reviewSchema.post('save', function () {
  // .this points to the current plot
  this.constructor.calcAverageRatings(this.plot);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // using this.r to pass the data from pre middleware to post middleware below
  this.r = await this.findOne();
  next();
});
// Works on delete and update
reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(this.r.plot);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
