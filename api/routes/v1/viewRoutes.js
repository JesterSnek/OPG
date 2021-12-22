const express = require('express');
const viewsController = require('../../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/plot/:slug', viewsController.getPlot);

module.exports = router;
