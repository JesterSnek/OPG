const rateLimit = require('express-rate-limit');
const constants = require('./constants');

const limiter = rateLimit({
  max: 50,
  windowMs: constants.RATE_LIMIT_WINDOW, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes.',
});

module.exports = limiter;
