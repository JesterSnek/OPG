const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.setUserTourIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    reviewController.updateReview
  )
  .get(reviewController.getReview);

module.exports = router;