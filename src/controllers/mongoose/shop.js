const Product = require('../../models/mongoose/product'); // importing the Product model
const Order = require('../../models/mongoose/order'); // importing the Order model

exports.getIndex = (req, res, next) => {
  // Fetching data using Mongoose
  Product.find()
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop City',
        path: '/',
        hasProducts: products.length > 0,
        shopIsActive: req.url === '/' ? 'active' : '',
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Fetching data using Mongoose
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  // Fetching using Mongoose
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productID')
    .then(user => {
      const products = user.cart.items;

      res.render('shop/cart', {
        products,
        hasProducts: products.length > 0,
        pageTitle: 'Your Cart',
        path: '/cart',
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;

  Product.findById(id)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postDeleteCartProduct = (req, res, next) => {
  const _id = req.body.productId;

  req.user
    .removeFromCart(_id)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userID': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        orders,
        hasOrders: orders.length > 0,
        pageTitle: 'Your Order',
        path: '/orders',
      });
    })
    .catch(err => console.log(err));
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate('cart.items.productID')
    .then(userInfo => {
      const email = req.user.email;
      const userID = req.user._id;
      const user = { email, userID };

      const products = userInfo.cart.items.map(item => ({
        product: { ...item.productID._doc },
        quantity: item.quantity,
      }));

      const totalPrice = products
        .map(item => item.product.price * item.quantity)
        .reduce((prev, curr, index) => prev + curr, 0);

      const order = new Order({ products, user, totalPrice });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
