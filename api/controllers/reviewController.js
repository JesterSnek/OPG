const Review = require('../middleware/reviewModelMiddleware');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);

exports.setUserPlotIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.plot) req.body.plot = req.params.plotId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
