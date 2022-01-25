const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Plot = require('../middleware/plotModelMiddleware');
const User = require('../middleware/userModelMiddleware');
const Order = require('../middleware/orderModelMiddleware');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the plot that was ordered from
  const plot = await Plot.findById(req.params.plotID);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-plots`,
    cancel_url: `${req.protocol}://${req.get('host')}/plot/${plot.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.plotID,
    line_items: [
      {
        name: `${plot.product.type} (in kilograms)`,
        description: plot.description,
        images: [
          `${req.protocol}://${req.get('host')}/img/plots/${plot.imageCover}`,
        ],
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

const createOrderCheckout = async (session) => {
  const plot = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;

  await Order.create({ plot, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_SIGNING_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createOrderCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
