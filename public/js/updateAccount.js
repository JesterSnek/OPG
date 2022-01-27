/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either "password" or "data"
export const updateAccount = async (data, type) => {
  try {
    const urlSuf =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const url =
      process.env.NODE_ENV === 'development'
        ? `http://127.0.0.1:8000${urlSuf}`
        : `${urlSuf}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Changed user data successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
