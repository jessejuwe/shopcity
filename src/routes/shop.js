const express = require('express');

const shopController = require('../controllers/mongoose/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  getOrders,
  postOrders,
  getCheckout,
  postDeleteCartProduct,
} = shopController;

// registering a middleware for serving index page (GET)
router.get('/', getIndex);

// registering a middleware for serving products page (GET)
router.get('/products', getProducts);

// registering a middleware for serving single product page (GET)
router.get('/products/:productId', getProduct);

// registering a middleware for serving cart page (GET)
router.get('/cart', isAuth, getCart);

// registering a middleware for adding to cart action (POST)
router.post('/cart', isAuth, postCart);

// registering a middleware for deleting from cart action (POST)
router.post('/cart-delete-item', isAuth, postDeleteCartProduct);

// registering a middleware for serving orders page (GET)
router.get('/orders', isAuth, getOrders);

// registering a middleware for adding new order (POST)
router.post('/create-order', isAuth, postOrders);

// registering a middleware for serving checkout page (GET)
router.get('/checkout', isAuth, getCheckout);

module.exports = router;
