const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  // Fetching data using MySQL (Sequelize)
  Product.findAll()
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
  // Fetching data using MySQL (Sequelize)
  Product.findAll()
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

  // Fetching using MySQL (Sequelize)
  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => console.log(err));

  // Alternative
  // Product.findAll({ where: { id: productId } })
  //   .then(result => {
  //     res.render('shop/product-detail', {
  //       product: result[0],
  //       pageTitle: result[0].title,
  //       path: '/products',
  //     });
  //   })
  //   .catch(err => console.log(err));
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
