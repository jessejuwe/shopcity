const express = require('express');

const authController = require('../controllers/mongoose/auth');

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = authController;

const router = express.Router();

// registering a middleware for serving login page (GET)
router.get('/login', getLogin);

// registering a middleware for login action (POST)
router.post('/login', postLogin);

// registering a middleware for logout action (POST)
router.post('/logout', postLogout);

// registering a middleware for serving signup page (GET)
router.get('/signup', getSignup);

// registering a middleware for signup action (POST)
router.post('/signup', postSignup);

// registering a middleware for serving reset password page (GET)
router.get('/reset-password', getReset);

// registering a middleware for reset password action (POST)
router.post('/reset-password', postReset);

// registering a middleware for serving new password page (GET)
router.get('/reset-password/:token', getNewPassword);

// registering a middleware for serving new password page (GET)
router.post('/new-password', postNewPassword);

module.exports = router;
