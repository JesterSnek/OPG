const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'You need to give a rating to submit a review!'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    plot: {
      type: mongoose.Schema.ObjectId,
      ref: 'Plot',
      required: [true, 'Review must belong to a plot.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an author.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = reviewSchema;
