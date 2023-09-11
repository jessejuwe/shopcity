const path = require('path');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

require('dotenv').config();

const rootDir = require('./src/utils/path');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');
const errorController = require('./src/controllers/error');
const User = require('./src/models/mongoose/user');

const { get404, get500 } = errorController;

const app = express();
const csrfProtection = csrf();

const store = new MongoDBStore({
  uri: process.env.MONGO_CLIENT,
  collection: 'sessions',
});

// prettier-ignore
const accessLog = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.cert');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    try {
      cb(null, `${uuidv4()}-${file.originalname}`);
    } catch (err) {
      throw new Error(err);
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// configuring templating engine
app.set('view engine', 'ejs'); // using ejs as the templating engine
app.set('views', './src/views');

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLog }));

// registering a middleware for parsing body (form data as text)
app.use(bodyParser.urlencoded({ extended: false }));

// registering a middleware for body (multi-part data)
app.use(multer({ storage, fileFilter }).single('image'));

// registering a middleware for static files (for importing files)
app.use(express.static(path.join(rootDir, 'public')));
app.use('/images', express.static(path.join(rootDir, 'images')));

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

// registering a middleware for storing local variables in request
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

// registering a middleware for storing user in request
app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then(user => {
      // throw new Error('No User found'); // used for throwing error in synchronous code
      if (!user) next();

      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err)); // used for throwing error in asynchronous code
    });
});

app.use('/admin', adminRoutes.router); // middleware for out-sourced routes
app.use(shopRoutes); // middleware for out-sourced routes
app.use(authRoutes); // middleware for out-sourced routes

// creating a middleware for handling technical errors
app.use(get500);

// creating a middleware for handling "page not found" errors
app.use(get404);

// registering an error-handling middleware
app.use((error, req, res, next) => {
  // res.redirect('/500');
  return res.status(500).render('500', {
    pageTitle: '500 - Technical issue',
    path: '/500',
    isLoggedIn: req.session.isLoggedIn,
  });
});

// Mongoose connection
const startConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CLIENT);

    app.listen(process.env.PORT || 3000);

    // ALTERNATIVE: using peronally created private key and certificate
    // https.createServer({ key, cert }, app).listen(process.env.PORT || 3000);
  } catch (err) {
    console.error(err);
  }
};

startConnection();

// mongoose
//   .connect(process.env.MONGO_CLIENT)
//   .then(() => app.listen(process.env.PORT || 3000))
//   .catch(err => console.log(err));
