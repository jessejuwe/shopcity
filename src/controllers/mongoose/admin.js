const Product = require('../../models/mongoose/product'); // importing the Product model

exports.getProducts = (req, res, next) => {
  // Fetching data using Mongoose
  Product.find()
    .populate('userID')
    .then(products => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  const adminIsActive = req.url === '/add-product' ? 'active' : '';

  const options = {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    adminIsActive,
    editMode: false,
    isLoggedIn: req.session.isLoggedIn,
  };

  res.render('admin/edit-product', options);
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = parseFloat(req.body.price);
  const description = req.body.description;
  const userID = req.user._id;

  const product = new Product({ title, imageUrl, price, description, userID });

  product
    .save()
    .then(() => res.redirect('/products'))
    .catch(err => console.log(err));
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
        isLoggedIn: req.session.isLoggedIn,
      };

      res.render('admin/edit-product', options);
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const _id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = parseFloat(req.body.price);
  const description = req.body.description;

  Product.findById(_id)
    .then(product => {
      if (!product) {
        console.log('Product not found.');
        return;
      }

      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;

      return product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const _id = req.body.productId;

  Product.findByIdAndDelete(_id)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
