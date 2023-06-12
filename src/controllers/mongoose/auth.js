const User = require('../../models/mongoose/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login to your account',
    path: '/login',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === '' || password === '') return;

  User.findOne({ email })
    .exec()
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;

      req.session.save(err => res.redirect('/products'));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => res.redirect('/'));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign up to ShopCity',
    path: '/signup',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (email === '' || password === '') return;
  if (password !== confirmPassword) return;

  User.findOne({ username: email })
    .exec()
    .then(user => {
      if (user) return;

      req.session.isLoggedIn = true;
      req.session.user = user;

      req.session.save(err => res.redirect('/products'));
    })
    .catch(err => console.log(err));
};
