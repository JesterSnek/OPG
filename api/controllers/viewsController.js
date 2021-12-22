const Plot = require('../middleware/plotModelMiddleware');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
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

  res.status(200).render('plot', {
    title: `${plot.name} plot`,
    plot,
  });
});
