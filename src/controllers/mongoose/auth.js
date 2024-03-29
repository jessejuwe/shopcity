const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const postmark = require('postmark');
const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');
const { query, matchedData, validationResult } = require('express-validator');

require('dotenv').config();

const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

const transporter = postmarkTransport({
  auth: { apiKey: process.env.POSTMARK_SERVER_TOKEN },
});

const transport = nodemailer.createTransport(transporter);

const User = require('../../models/mongoose/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');

  message = message.length > 0 ? message[0] : null;

  res.render('auth/login', {
    pageTitle: 'Login to your account',
    path: '/login',
    errorMessage: message,
    oldInput: { email: '', password: '' },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login to your account',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          pageTitle: 'Login to your account',
          path: '/login',
          errorMessage: 'User not found',
          oldInput: { email, password },
          validationErrors: errors.array(),
        });
      }

      bcrypt
        .compare(password, user.password)
        .then(match => {
          if (!match) {
            return res.status(422).render('auth/login', {
              pageTitle: 'Login to your account',
              path: '/login',
              errorMessage: 'Invalid password',
              oldInput: { email, password },
              validationErrors: errors.array(),
            });
          }

          req.session.isLoggedIn = true;
          req.session.user = user;

          return req.session.save(err => res.redirect('/products'));
        })
        .catch(err => res.redirect('/login'));
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => res.redirect('/'));
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');

  message = message.length > 0 ? message[0] : null;

  res.render('auth/signup', {
    pageTitle: 'Sign up to Shop City',
    path: '/signup',
    errorMessage: message,
    oldInput: { email: '', pwd: '', confirmPwd: '' },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Sign up to Shop City',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, pwd, confirmPwd: req.body.confirmPassword },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(pwd, 12)
    .then(password => {
      const user = new User({ email, password, cart: { items: [] } });

      return user.save();
    })
    .then(() => {
      res.redirect('/login');

      const TemplateModel = {
        product_url: 'http://localhost:3010',
        product_name: 'Shop City',
        name: email.split('@')[0],
        action_url: 'http://localhost:3010/products',
        login_url: 'http://localhost:3010/login',
        username: email.split('@')[0],
        trial_length: '30',
        trial_start_date: '01/07/23',
        trial_end_date: '31/07/23',
        support_email: 'info@zutego.com',
        live_chat_url: 'http://localhost:3010/live-chat',
        sender_name: 'Jesse Juwe',
        help_url: 'http://localhost:3010/help',
        company_name: 'Zutego',
        company_address: 'Lagos, Nigeria',
      };

      return client.sendEmailWithTemplate({
        TemplateId: 32232505,
        From: 'info@zutego.com',
        To: email,
        TemplateModel,
      });

      return transport.sendMail({
        to: email,
        from: 'info@shopcity.com',
        subject: 'Signup successful',
        html: '<div><h1>Welcome to Shopcity</h1><p>You have successfully created an account.</p></div>',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');

  message = message.length > 0 ? message[0] : null;

  res.render('auth/reset', {
    pageTitle: 'Reset your password',
    path: '/reset-password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect('/reset-password');

    const token = buffer.toString('hex');

    User.findOne({ email })
      .exec()
      .then(user => {
        if (!user) {
          req.flash('error', 'User not found.');
          return res.redirect('/reset-password');
        }

        user.resetToken = token;
        user.tokenExpiration = Date.now() + 3600000;

        return user.save();
      })
      .then(() => {
        res.redirect('/');

        const TemplateModel = {
          product_url: 'http://localhost:3010',
          product_name: 'Shop City',
          name: email.split('@')[0],
          action_url: `http://localhost:3010/reset-password/${token}`,
          operating_system: 'Windows 10 Home',
          browser_name: 'Google Chrome',
          support_email: 'info@zutego.com',
          company_name: 'Zutego',
          company_address: 'Lagos, Nigeria',
        };

        client.sendEmailWithTemplate({
          TemplateId: 32233320,
          From: 'info@zutego.com',
          To: email,
          TemplateModel,
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.status = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const resetToken = req.params.token;

  const tokenExpiration = { $gt: Date.now() };

  let message = req.flash('error');

  message = message.length > 0 ? message[0] : null;

  User.findOne({ resetToken, tokenExpiration })
    .exec()
    .then(user => {
      if (!user) {
        req.flash('error', 'User not found.');
        return res.redirect('/new-password');
      }

      res.render('auth/new-password', {
        pageTitle: 'Create new password',
        path: '/new-password',
        errorMessage: message,
        userId: user._id.toString(),
        resetToken,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const pwd = req.body.password;
  const confirmPwd = req.body.confirmPassword;
  const _id = req.body.userId;
  const resetToken = req.body.resetToken;

  const tokenExpiration = { $gt: Date.now() };

  if ((pwd === confirmPwd) === '') {
    req.flash('error', 'Enter valid password.');
    return res.redirect('/new-password');
  }

  if (pwd !== confirmPwd) {
    req.flash('error', 'Password mismatch.');
    return res.redirect('/new-password');
  }

  User.findOne({ resetToken, tokenExpiration, _id })
    .exec()
    .then(user => {
      if (!user) {
        req.flash('error', 'User not found.');
        return res.redirect('/new-password');
      }

      return bcrypt
        .hash(pwd, 12)
        .then(password => {
          user.password = password;
          user.resetToken = undefined;
          user.tokenExpiration = undefined;

          return user.save();
        })
        .then(() => res.redirect('/login'));
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};
