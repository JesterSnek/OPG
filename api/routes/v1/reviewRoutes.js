const express = require('express');
const reviewController = require('../../controllers/reviewController');
const authController = require('../../controllers/authController');

const router = express.Router({ mergeParams: true });

//Protected Routes
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setUserTourIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview)
  .get(reviewController.getReview);

module.exports = router;
