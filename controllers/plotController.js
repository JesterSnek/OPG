const Plot = require('../middleware/plotModelMiddleware');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllFamilyPlots = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Plot.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  //EXECUTE QUERY
  const plots = await features.query;

  res.status(200).json({
    status: 'success',
    results: plots.length,
    data: {
      plots,
    },
  });
});

exports.getPlot = catchAsync(async (req, res, next) => {
  const plot = await Plot.findById(req.params.plotid).populate('reviews');

  if (!plot) {
    return next(new AppError('No plot found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      plot,
    },
  });
});

exports.uploadPlot = catchAsync(async (req, res, next) => {
  const newPlot = await Plot.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      plot: newPlot,
    },
  });
});

exports.updatePlot = catchAsync(async (req, res, next) => {
  const plot = await Plot.findByIdAndUpdate(req.params.plotid, req.body, {
    new: true, // returns the modified document and not the original
    runValidators: true,
  });

  if (!plot) {
    return next(new AppError('No plot found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      plot,
    },
  });
});

exports.deletePlot = catchAsync(async (req, res, next) => {
  const plot = await Plot.findByIdAndDelete(req.params.plotid);

  if (!plot) {
    return next(new AppError('No plot found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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
