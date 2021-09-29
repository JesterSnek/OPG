const express = require('express');

const app = express();
const morgan = require('morgan');

const plotRouter = require('./routes/plotRoutes');
const userRouter = require('./routes/userRoutes');

//middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes
app.use('/api/v1/:opgid/plots', (req, res, next) => {
  req.opgid = req.params.opgid; //passing a parameter to a mounted route
  plotRouter(req, res, next);
});
app.use('/api/v1/users', userRouter);

module.exports = app;
