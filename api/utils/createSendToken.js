const signToken = require('./signToken');
const constants = require('../../constants/constantsCommon');

module.exports = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * constants.ONE_DAY
    ),
    httpOnly: true, // this makes it so the cookie can't be accessed or modified by the browser
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https', // cookie will only be sent on a encrypted connection.
  });

  //Remove pass from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
