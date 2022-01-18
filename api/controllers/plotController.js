const multer = require('multer');
const sharp = require('sharp');
const Plot = require('../middleware/plotModelMiddleware');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPlotImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images' },
]);

exports.resizePlotImageCover = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover) return next();

  req.body.imageCover = `plot-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(1920, 1080)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/plots/${req.body.imageCover}`);

  next();
});

exports.resizePlotImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `plot-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(1920, 1080)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/plots/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

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
