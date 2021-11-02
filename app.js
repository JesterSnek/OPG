const express = require('express');

const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const rateLimit = require('./utils/rateLimit');
const globalErrorHandler = require('./controllers/errorController');
const plotRouter = require('./routes/plotRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

//Data Sanitization
app.use(helmet()); // Set Security HTTP headers
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit request from same IP
app.use('/api', rateLimit);
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

//Routes
app.use('/api/v1/plots', (req, res, next) => {
  //req.opgid = req.params.opgid; //passing a parameter to a mounted route
  plotRouter(req, res, next);
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
