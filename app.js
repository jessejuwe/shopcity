const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const rootDir = require('./src/utils/path');

const sequelize = require('./src/utils/database');
const adminData = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');
const errorController = require('./src/controllers/error');

const { get404 } = errorController;

const app = express();

// configuring templating engine
app.set('view engine', 'ejs'); // using ejs as the templating engine
app.set('views', './src/views');

// creating a middleware for parsing body
app.use(bodyParser.urlencoded({ extended: false }));

// creating a middleware for static files (for importing files)
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.router); // middleware for out-sourced routes
app.use(shopRoutes); // middleware for out-sourced routes

// creating a middleware for handling error pages
app.use(get404);

sequelize
  .sync()
  .then(() => app.listen(3010))
  .catch(err => console.log(err));
