const express = require('express');
const viewsController = require('../../controllers/viewsController');
const authController = require('../../controllers/authController');

const router = express.Router();

// Protected routes

router.get('/me', authController.protect, viewsController.getAccount);

// Unprotected routes
router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/plot/:slug', viewsController.getPlot);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

module.exports = router;
