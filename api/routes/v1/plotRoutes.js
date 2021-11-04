const express = require('express');
const plotController = require('../../controllers/plotController');
const authController = require('../../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:plotId/reviews', reviewRouter);

router.route('/plot-stats').get(plotController.getPlotStats);

router
  .route('/')
  .get(plotController.getAllFamilyPlots)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-mod'),
    plotController.createPlot
  );

router
  .route('/:id')
  .get(plotController.getPlot)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-mod', 'mod'),
    plotController.updatePlot
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-mod'),
    plotController.deletePlot
  );

module.exports = router;
