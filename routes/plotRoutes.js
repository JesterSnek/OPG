const express = require('express');
const plotController = require('../controllers/plotController');
const authController = require('../controllers/authController');

const router = express.Router();

//router.param('plotid', plotController.checkID);

router.route('/plot-stats').get(plotController.getPlotStats);

router
  .route('/')
  .get(authController.protect, plotController.getAllFamilyPlots)
  .post(plotController.uploadPlot);
router
  .route('/:plotid')
  .get(plotController.getPlot)
  .patch(plotController.updatePlot)
  .delete(plotController.deletePlot);

module.exports = router;
