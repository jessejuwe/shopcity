const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const rootDir = require('./src/utils/path');

const sequelize = require('./src/utils/database');
const Product = require('./src/models/product');
const User = require('./src/models/sequelize/users');
const Cart = require('./src/models/sequelize/cart');
const CartItem = require('./src/models/cart-item');
const Order = require('./src/models/order');
const OrderItem = require('./src/models/order-item');
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

// registering a middleware for storing currently logged in user to request
app.use((req, res, next) => {
  User.findAll({ where: { name: 'Jesse' } })
    .then(user => {
      req.user = user[0];
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminData.router); // middleware for out-sourced routes
app.use(shopRoutes); // middleware for out-sourced routes

// creating a middleware for handling error pages
app.use(get404);

// SQL related
// Adding association between SQL tables
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

let foundUser;

sequelize
  //   .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then(user =>
    !user ? User.create({ name: 'Jesse', email: 'jessejuwe@gmail.com' }) : user
  )
  .then(user => {
    foundUser = user;
    return foundUser.getCart();
  })
  .then(cart => (cart ? cart : foundUser.createCart()))
  .then(() => app.listen(3010))
  .catch(err => console.log(err));
