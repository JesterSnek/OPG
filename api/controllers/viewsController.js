const Plot = require('../middleware/plotModelMiddleware');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get plot data from collection
  const plots = await Plot.find();
  // 2) Build template

  // 3) Render template using plot data from step 1)

  res.status(200).render('overview', {
    title: 'All Plots',
    plots,
  });
});

exports.getPlot = catchAsync(async (req, res, next) => {
  const plot = await Plot.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!plot) return next(new AppError('There is no plot with that name.', 404));

  res.status(200).render('plot', {
    title: `${plot.name} plot`,
    plot,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Register an account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
