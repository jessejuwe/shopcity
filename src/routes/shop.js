const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  getOrders,
  getCheckout,
  postDeleteCartProduct,
} = shopController;

// creating a middleware for serving index page
router.get('/', getIndex);

// creating a middleware for serving products page
router.get('/products', getProducts);

// creating a middleware for serving single product page
router.get('/products/:productId', getProduct);

// creating a middleware for serving cart page (GET)
router.get('/cart', getCart);

// creating a middleware for serving cart page (POST)
router.post('/cart', postCart);

// creating a middleware for serving cart page (POST)
router.post('/cart-delete-item', postDeleteCartProduct);

// creating a middleware for serving orders page
router.get('/orders', getOrders);

// creating a middleware for serving checkout page
router.get('/checkout', getCheckout);

module.exports = router;
