const express = require('express');

const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const plotRouter = require('./routes/plotRoutes');
const userRouter = require('./routes/userRoutes');

//GLOBAL MIDDLEWARE
app.use(helmet()); // Set Security HTTP headers
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit request from same IP
const limiter = rateLimit({
  max: 50,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes.',
});
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'soilType',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'size',
    ],
  })
);
// Serving static files
app.use(express.static(`${__dirname}/public`));
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//Routes
app.use('/api/v1/plots', (req, res, next) => {
  //req.opgid = req.params.opgid; //passing a parameter to a mounted route
  plotRouter(req, res, next);
});
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
