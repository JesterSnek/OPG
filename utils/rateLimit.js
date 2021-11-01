const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  max: 50,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes.',
});

module.exports = limiter;
