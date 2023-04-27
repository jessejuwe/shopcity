const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const rootDir = require('./utils/path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const { get404 } = errorController;

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

// configuring templating engine
app.set('view engine', 'ejs'); // using ejs as the templating engine
app.set('views', 'views');

// creating a middleware for parsing body
app.use(bodyParser.urlencoded({ extended: false }));

// creating a middleware for static files (for importing files)
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.router); // middleware for out-sourced routes
app.use(shopRoutes); // middleware for out-sourced routes

// creating a middleware for handling error pages
app.use(get404);

app.listen(3010);
