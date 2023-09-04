const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/mongoose/auth');
const User = require('../models/mongoose/user');

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
router.post(
  '/login',
  [
    body('email', 'Enter valid E-mail').isEmail().normalizeEmail(),
    body('password', 'Enter valid password').isStrongPassword().trim(),
  ],
  postLogin
);

// registering a middleware for logout action (POST)
router.post('/logout', postLogout);

// registering a middleware for serving signup page (GET)
router.get('/signup', getSignup);

// registering a middleware for signup action (POST)
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Enter valid E-mail')
      .custom((email, { req }) => {
        User.findOne({ email })
          .exec()
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Email already exists').catch(err => {});
            }
          });
      })
      .normalizeEmail(),
    body('password')
      .isStrongPassword()
      .withMessage('Use a strong password')
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Password mismatch');
        return true;
      })
      .trim(),
  ],
  postSignup
);

// registering a middleware for serving reset password page (GET)
router.get('/reset-password', getReset);

// registering a middleware for reset password action (POST)
router.post('/reset-password', postReset);

// registering a middleware for serving new password page (GET)
router.get('/reset-password/:token', getNewPassword);

// registering a middleware for serving new password page (GET)
router.post('/new-password', postNewPassword);

module.exports = router;
