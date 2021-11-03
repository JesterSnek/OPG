const Plot = require('../middleware/plotModelMiddleware');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllFamilyPlots = factory.getAll(Plot);
exports.getPlot = factory.getOne(Plot, { path: 'reviews' });
exports.createPlot = factory.createOne(Plot);
exports.updatePlot = factory.updateOne(Plot);
exports.deletePlot = factory.deleteOne(Plot);

exports.getPlotStats = catchAsync(async (req, res, next) => {
  const stats = await Plot.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$ratingsAverage',
        numRatings: { $sum: '$ratingsQuantity' },
        numPlots: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        minRating: { $min: '$ratingsAverage' },
        maxRating: { $max: '$ratingsAverage' },
        avgSize: { $avg: '$size' },
      },
    },
    {
      $sort: { avgSize: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
