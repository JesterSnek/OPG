/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const url =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/api/v1/users/signup'
        : '/api/v1/users/signup';

    const res = await axios({
      method: 'POST',
      url,
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
