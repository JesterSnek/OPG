/* eslint-disable */
import axios from 'axios';
const stripe = Stripe(
  'pk_test_51KK3q2H5pYRnD6ejOXzgE9nEVhOvA4HiZIHxQJ5EMWcMNoxvbD1pMsipxJRVMdTJbw7cye9j6EQvo8GOEAz8NGYg00jRXv20Hy'
);
import { showAlert } from './alerts';

export const orderProduct = async (plotId) => {
  try {
    // get session from API
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/orders/checkout-session/${plotId}`
    );

    // create checkout form and charge the CC
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch {
    console.log(err);
    showAlert('error', err);
  }
};
