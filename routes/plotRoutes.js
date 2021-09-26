const express = require('express');
const plotController = require('./../controllers/plotController');

const router = express.Router();

router
  .route('/')
  .get(plotController.getAllFamilyPlots)
  .post(plotController.uploadPlot);
router.route('/:plotid').get(plotController.getPlot);

module.exports = router;
