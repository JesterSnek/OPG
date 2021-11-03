const express = require('express');
const plotController = require('../controllers/plotController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:plotId/reviews', reviewRouter);

router.route('/plot-stats').get(plotController.getPlotStats);

router
  .route('/')
  .get(authController.protect, plotController.getAllFamilyPlots)
  .post(plotController.uploadPlot);
router
  .route('/:plotid')
  .get(plotController.getPlot)
  .patch(plotController.updatePlot)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-mod'),
    plotController.deletePlot
  );

module.exports = router;
