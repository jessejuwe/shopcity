const Product = require('../../models/mongoDB/product');

exports.getIndex = (req, res, next) => {
  // Fetching data using MongoDB
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'ShopCity',
        path: '/',
        hasProducts: products.length > 0,
        shopIsActive: req.url === '/' ? 'active' : '',
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Fetching data using MongoDB
  Product.fetchAll()
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

  // Fetching using MongoDB
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
    .getCart()
    .then(products => {
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
  const id = req.body.productId;

  req.user
    .removeFromCart(id)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders =>
      res.render('shop/orders', {
        orders,
        hasOrders: orders.length > 0,
        pageTitle: 'Your Order',
        path: '/orders',
      })
    )
    .catch(err => console.log(err));
};

exports.postOrders = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
