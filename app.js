const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

require('dotenv').config();

const rootDir = require('./src/utils/path');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');
const errorController = require('./src/controllers/error');
const User = require('./src/models/mongoose/user');

const { get404 } = errorController;

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_CLIENT,
  collection: 'sessions',
});
const csrfProtection = csrf();

// configuring templating engine
app.set('view engine', 'ejs'); // using ejs as the templating engine
app.set('views', './src/views');

// registering a middleware for parsing body
app.use(bodyParser.urlencoded({ extended: false }));

// registering a middleware for static files (for importing files)
app.use(express.static(path.join(rootDir, 'public')));

// registering a middleware for initializing sessions
app.use(
  session({
    secret: 'hashkey#',
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// registering a middleware for initializing CSRF Token
app.use(csrfProtection);

// registering a middleware for exposing middlewares
app.use(flash());

// registering a middleware for storing user in request
app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// registering a middleware for storing local variables in request
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use('/admin', adminRoutes.router); // middleware for out-sourced routes
app.use(shopRoutes); // middleware for out-sourced routes
app.use(authRoutes); // middleware for out-sourced routes

// creating a middleware for handling error pages
app.use(get404);

// Mongoose connection
mongoose
  .connect(process.env.MONGO_CLIENT)
  .then(() => app.listen(3010))
  .catch(err => console.log(err));
