const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/mongoose/admin');
const isAuth = require('../middleware/is-auth');

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = adminController;

const router = express.Router();

// registering a middleware ('admin/products') ==> limited to GET
router.get('/products', isAuth, getProducts);

// registering a middleware ('admin/add-product') ==> limited to GET
router.get('/add-product', isAuth, getAddProduct);

// registering a middleware ('admin/add-product') ==> limited to POST
router.post(
  '/add-product',
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 8, max: 150 }).trim(),
  ],
  isAuth,
  postAddProduct
);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.get('/edit-product/:productId', isAuth, getEditProduct);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.post(
  '/edit-product',
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 8, max: 150 }).trim(),
  ],
  isAuth,
  postEditProduct
);

// registering a middleware ('admin/edit-product') ==> limited to GET
router.delete('/product/:productId', isAuth, deleteProduct);

module.exports = { router };
