const slugify = require('slugify');
const mongoose = require('mongoose');
const plotSchema = require('../models/plotModel');

//not getting saved to DB, cant be accessed by queries
plotSchema.virtual('sizeAcres').get(function () {
  return this.size / 4047; // approx conversion from km squared to acres
});

// Virtual populate // Doesn't persist to the DB incase theres thousands of reviews in the future
plotSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'plot',
  localField: '_id',
});

//Document middleware, runs before .save() and .create()
plotSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query Middleware ^find means all the strings that start with find
plotSchema.pre(/^find/, function (next) {
  this.find({ secretPlot: { $ne: true } });
  this.start = Date.now();
  next();
});

//Aggregation Middleware
plotSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretPlot: { $ne: true } } });

  next();
});

const Plot = mongoose.model('Plot', plotSchema);

module.exports = Plot;
