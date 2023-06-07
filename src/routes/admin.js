const express = require('express');

const adminController = require('../controllers/mongoDB/admin');

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = adminController;

const router = express.Router();

// creating a middleware ('admin/products') ==> limited to GET
router.get('/products', getProducts);

// creating a middleware ('admin/add-product') ==> limited to GET
router.get('/add-product', getAddProduct);

// creating a middleware ('admin/add-product') ==> limited to POST
router.post('/add-product', postAddProduct);

// creating a middleware ('admin/edit-product') ==> limited to GET
// router.get('/edit-product/:productId', getEditProduct);

// creating a middleware ('admin/edit-product') ==> limited to GET
// router.post('/edit-product', postEditProduct);

// creating a middleware ('admin/edit-product') ==> limited to GET
// router.post('/delete-product', postDeleteProduct);

module.exports = { router };
