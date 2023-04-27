const express = require('express');

const adminController = require('../controllers/admin');

const { getAddProducts, postAddProducts, getProducts } = adminController;

const router = express.Router();

// creating a middleware ('admin/add-product') ==> limited to GET
router.get('/add-product', getAddProducts);

// creating a middleware ('admin/products') ==> limited to GET
router.get('/products', getProducts);

// creating a middleware ('admin/add-product') ==> limited to POST
router.post('/add-product', postAddProducts);

module.exports = { router };
