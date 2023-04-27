import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';

const rootDir = require('./utils/path');

const app = express();

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const { get404 } = errorController;

// configuring templating engine
app.set('view engine', 'ejs'); // using ejs as the templating engine
app.set('views', 'views');

// creating a middleware for parsing body
app.use(bodyParser.urlencoded({ extended: false }));

// creating a middleware for static files
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.router); // middleware for out-sourced routes
app.use(shopRoutes); // middleware for out-sourced routes

// creating a middleware for handling error pages
app.use(get404);

app.listen(3010);
