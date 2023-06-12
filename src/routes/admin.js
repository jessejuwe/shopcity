const express = require('express');

const adminController = require('../controllers/mongoose/admin');
// const adminController = require('../controllers/mongoDB/admin');

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
router.get('/products', getProducts);

// registering a middleware ('admin/add-product') ==> limited to GET
router.get('/add-product', getAddProduct);

// registering a middleware ('admin/add-product') ==> limited to POST
router.post('/add-product', postAddProduct);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.get('/edit-product/:productId', getEditProduct);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.post('/edit-product', postEditProduct);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.post('/delete-product', postDeleteProduct);

module.exports = { router };
