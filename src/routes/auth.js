const express = require('express');

const authController = require('../controllers/mongoose/auth');

const { getLogin, postLogin, postLogout, getSignup, postSignup } =
  authController;

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

module.exports = router;
