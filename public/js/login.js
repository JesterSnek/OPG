/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const url =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/api/v1/users/login'
        : '/api/v1/users/login';

    const res = await axios({
      method: 'POST',
      url,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
