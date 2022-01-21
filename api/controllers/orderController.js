const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Plot = require('../middleware/plotModelMiddleware');
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the plot that was ordered from
  const plot = await Plot.findById(req.params.plotID);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/plot/${plot.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.plotID,
    line_items: [
      {
        name: `${plot.product.type} (in kilograms)`,
        description: plot.description,
        amount: plot.product.price * 100, // * 100 because it is calculated in cents
        currency: 'eur',
        adjustable_quantity: {
          enabled: true,
          minimum: 5,
          maximum: 100,
        },
        quantity: 5,
      },
    ],
  });
  // create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
