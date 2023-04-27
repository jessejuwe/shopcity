const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products =>
    res.render('shop/index', {
      products,
      pageTitle: 'ShopCity',
      path: '/',
      hasProducts: products.length > 0,
      shopIsActive: req.url === '/' ? 'active' : '',
    })
  );
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products =>
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: '/products',
    })
  );
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.fetchProduct(productId, product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: `/products/${productId}`,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
