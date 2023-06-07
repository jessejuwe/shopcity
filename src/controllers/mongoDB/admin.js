const Product = require('../../models/mongoDB/product');

exports.getProducts = (req, res, next) => {
  // Fetching data using MongoDB
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
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
  };

  res.render('admin/edit-product', options);
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);

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
      };

      res.render('admin/edit-product', options);
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findByPk(id)
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
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
