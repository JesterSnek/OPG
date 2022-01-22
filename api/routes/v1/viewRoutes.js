const express = require('express');
const viewsController = require('../../controllers/viewsController');
const authController = require('../../controllers/authController');
const orderController = require('../../controllers/orderController');

const router = express.Router();

// Protected routes

router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-orders', authController.protect, viewsController.getMyOrders);

// Unprotected routes
router.use(authController.isLoggedIn);

router.get(
  '/',
  orderController.createOrderCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

router.get('/plot/:slug', viewsController.getPlot);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

module.exports = router;
