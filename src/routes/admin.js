const express = require('express');

const adminController = require('../controllers/mongoose/admin');
const isAuth = require('../middleware/is-auth');

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = adminController;

const router = express.Router();

// registering a middleware ('admin/products') ==> limited to GET
router.get('/products', isAuth, getProducts);

// registering a middleware ('admin/add-product') ==> limited to GET
router.get('/add-product', isAuth, getAddProduct);

// registering a middleware ('admin/add-product') ==> limited to POST
router.post('/add-product', isAuth, postAddProduct);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.get('/edit-product/:productId', isAuth, getEditProduct);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.post('/edit-product', isAuth, postEditProduct);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.post('/delete-product', isAuth, postDeleteProduct);

module.exports = { router };
