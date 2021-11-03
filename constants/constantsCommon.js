module.exports = Object.freeze({
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  PASSWORD_RESET_TIMER: 10 * 60 * 1000, // 10 minutes
  ONE_DAY: 24 * 60 * 60 * 1000, // 24 hrs
});
