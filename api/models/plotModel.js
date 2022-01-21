const mongoose = require('mongoose');

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
        values: ['Clay', 'Peat', 'Sandy', 'Silt', 'Chalky', 'Loamy'],
        message: 'Soil types can be clay, peat, silt, sandy, chalky or loamy.',
      },
    },
    trees: {
      type: Number,
    },
    imageCover: {
      type: String,
    },
    images: {
      type: [String],
      max: [50],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at or above 1.0'],
      max: [5, 'Rating must be at or below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    secretPlot: {
      type: Boolean,
      default: false,
      select: false,
    },
    location: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    product: {
      type: {
        type: String,
        default: 'Tangerine',
        enum: ['Tangerine', 'Lemon'],
      },
      price: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexing fields that are likely to be queried for often - Greatly increases efficiency
plotSchema.index({ size: -1, ratingsAverage: -1 }); // Compound index
plotSchema.index({ slug: 1 });

module.exports = plotSchema;
