const express = require('express');

const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./api/utils/appError');
const rateLimit = require('./api/utils/rateLimit');
const globalErrorHandler = require('./api/controllers/errorController');
const plotRouter = require('./api/routes/v1/plotRoutes');
const userRouter = require('./api/routes/v1/userRoutes');
const reviewRouter = require('./api/routes/v1/reviewRoutes');
const orderRouter = require('./api/routes/v1/orderRoutes');
const viewRouter = require('./api/routes/v1/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// CORS Implementation
app.use(cors()); // Enough for simple requests
app.options('*', cors()); // Responding to the options request in order to enable CORS for non simple requests
// Serving static files
app.use(express.static(`${__dirname}/public`));
//Data Sanitization
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit request from same IP
app.use('/api', rateLimit);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
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

app.use(compression());

//Routes
app.use('/', viewRouter);
app.use('/api/v1/plots', (req, res, next) => {
  //req.opgid = req.params.opgid; //passing a parameter to a mounted route
  plotRouter(req, res, next);
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
