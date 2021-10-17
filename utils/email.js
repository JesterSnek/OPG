const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'Josip Vistica <hello@jester.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // Send the email
  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
