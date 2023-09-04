const { query, matchedData, validationResult } = require('express-validator');

const Product = require('../../models/mongoose/product'); // importing the Product model
const fileHelper = require('../../utils/file'); // importing the Product model

exports.getProducts = (req, res, next) => {
  const userID = req.user._id;

  // Fetching data using Mongoose
  Product.find({ userID })
    .populate('userID')
    .then(products => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.getAddProduct = (req, res, next) => {
  const adminIsActive = req.url === '/add-product' ? 'active' : '';

  const options = {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    adminIsActive,
    editMode: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  };

  res.render('admin/edit-product', options);
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = parseFloat(req.body.price);
  const description = req.body.description;
  const userID = req.user._id;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      product: { title, price, description },
      pageTitle: 'Add product',
      path: '/admin/add-product',
      editMode: false,
      hasError: true,
      errorMessage: 'Selected file is not an image format',
      validationErrors: [],
    });
  }

  const imageUrl = image.path;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product: { title, price, description },
      pageTitle: 'Add product',
      path: '/admin/add-product',
      editMode: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({ title, imageUrl, price, description, userID });

  product
    .save()
    .then(() => res.status(201).redirect('/products'))
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
      // return res.status(500).render('admin/edit-product', {
      //   product: { title, price, description },
      //   pageTitle: 'Add product',
      //   path: '/admin/add-product',
      //   editMode: false,
      //   hasError: true,
      //   errorMessage: err.message, // message might not exist on err
      //   validationErrors: 500,
      // });

      // res.redirect('/500'); // alternative error handling method
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) return res.redirect('/');

  const id = req.params.productId;

  Product.findById(id)
    .then(product => {
      if (!product) return res.redirect('/products');

      const options = {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editMode,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      };

      res.render('admin/edit-product', options);
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const _id = req.body.productId;
  const title = req.body.title;
  const image = req.file;
  const price = parseFloat(req.body.price);
  const description = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product: { _id, title, price, description },
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editMode: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(_id)
    .then(product => {
      const prodID = product.userID.toString();
      const userID = req.user._id.toString();

      if (!product) return res.redirect('/');

      if (prodID !== userID) return res.redirect('/');

      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }

      return product.save().then(() => res.redirect('/admin/products'));
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const _id = req.params.productId;
  const userID = req.user._id;

  Product.findById(_id)
    .then(product => {
      if (!product) return next(new Error('Product not found'));

      fileHelper.deleteFile(product.imageUrl);

      return Product.deleteOne({ _id, userID });
    })
    .then(() =>
      res.status(200).json({ message: 'Product deleted successfully' })
    )
    .catch(err =>
      res.status(500).json({ message: 'Failed to delete product' })
    );
};
