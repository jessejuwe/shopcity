const Product = require('../models/product');
const Cart = require('../models/cart');

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
      path: '/products',
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];

      if (!cart) return;

      products.forEach(product => {
        // prettier-ignore
        const cartProductData = cart.products.find(item => item.id === product.id);

        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      });

      res.render('shop/cart', {
        products: cartProducts,
        hasProducts: products.length > 0,
        pageTitle: 'Your Cart',
        path: '/cart',
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.fetchProduct(productId, product => {
    Cart.addProduct(productId, product.price);
  });

  res.redirect('/cart');
};

exports.postDeleteCartProduct = (req, res, next) => {
  const id = req.body.productId;

  Product.fetchProduct(id, product => {
    Cart.deleteProduct(id, product.price);
    res.redirect('/cart');
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
