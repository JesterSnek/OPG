/* eslint-disable */
import 'regenerator-runtime/runtime';
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';
import { signup } from './signup';
import { logout } from './logout';

// DOM ELEMENTS
//const plotName = JSON.parse(document.getElementById('name').dataset.name);
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const logOutBtn = document.querySelector('.nav__el--logout');

// DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    console.log(name, email, password, passwordConfirm);
    signup(name, email, password, passwordConfirm);
  });
}
