const express = require('express');
const plotController = require('../controllers/plotController');

const router = express.Router();

//router.param('plotid', plotController.checkID);

router
  .route('/')
  .get(plotController.getAllFamilyPlots)
  .post(plotController.uploadPlot);
router
  .route('/:plotid')
  .get(plotController.getPlot)
  .patch(plotController.updatePlot);

module.exports = router;
