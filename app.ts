import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import expressHbs from 'express-handlebars';

import rootDir from './src/utils/path';
import errorController from './src/controllers/error';
import adminData from './src/routes/admin';
import shopRoutes from './src/routes/shop';

const app = express();

// registering a new templating engine for handlebars
// app.engine(
//   'hbs',
//   expressHbs.engine({ extname: '.hbs', layoutsDir: './views/layouts' })
// );

// configuring templating engine
// app.set('view engine', 'pug'); // using pug as the templating engine
// app.set('views', 'views');

// configuring templating engine
// app.set('view engine', 'hbs'); // using hbs as the templating engine
// app.set('views', './views');

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
