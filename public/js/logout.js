/* eslint-disable */
import axios from 'axios';

export const logout = async () => {
  try {
    const url =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/api/v1/users/logout'
        : '/api/v1/users/logout';

    const res = await axios({
      method: 'GET',
      url,
    });

    // true in location.reload(true) makes sure a fresh reload from the server comes in, instead of the browser cache reload.
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
