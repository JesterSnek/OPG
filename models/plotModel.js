const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

const plotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A plot must have a name.'], //validator
      unique: true,
      trim: true,
      maxlength: [40, 'A plot name must have 40 or less characters.'],
      minlength: [3, 'A plot name must have 3 or more characters.'],
    },
    slug: String,
    description: String,
    size: {
      type: Number,
      required: [true, 'Plot size is required.'],
    },
    soilType: {
      type: String,
      enum: {
        values: ['clay', 'peat', 'sandy', 'silt', 'chalky', 'loamy'],
        message: 'Soil types can be clay, peat, silt, sandy, chalky or loamy.',
      },
    },
    trees: {
      type: Number,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at or above 1.0'],
      max: [5, 'Rating must be at or below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    secretPlot: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//not getting saved to DB, cant be accessed by queries
plotSchema.virtual('sizeAcres').get(function () {
  return this.size / 4047;
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
