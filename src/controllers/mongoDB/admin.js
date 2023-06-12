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
  const userID = req.user._id;

  const product = new Product(
    title,
    imageUrl,
    price,
    description,
    null,
    userID
  );

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
    .then(prod => {
      if (!prod) return res.redirect('/products');

      const product = { ...prod, price: parseFloat(prod.price) };

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
  const _id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description, _id);

  if (!product) {
    console.log('Product not found.');
    return;
  }

  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.deleteById(productId)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
