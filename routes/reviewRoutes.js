const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.uploadReview);

router.route('/:reviewid').get(reviewController.getReview);

module.exports = router;
