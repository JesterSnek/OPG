/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Signed up successfully! Redirecting you to the homepage in 5 seconds.'
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
