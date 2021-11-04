const signToken = require('./signToken');
const constants = require('../../constants/constantsCommon');

module.exports = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * constants.ONE_DAY
    ),
    httpOnly: true, // this makes it so the cookie can't be accessed or modified by the browser
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // cookie will only be sent on a encrypted connection. https
  res.cookie('jwt', token, cookieOptions);
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
