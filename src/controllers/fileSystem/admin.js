const Product = require('../../models/product');

exports.getProducts = (req, res, next) => {
  // Fetching data using File System
  Product.fetchAll(products =>
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  );
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

  Product.create({ title, imageUrl, price, description })
    .then(result => console.log('Product Created'))
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) return res.redirect('/');

  const productId = req.params.productId;

  Product.fetchProduct(productId, product => {
    if (!product) return res.redirect('/products');

    const options = {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editMode,
    };

    res.render('admin/edit-product', options);
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(id, title, imageUrl, price, description);

  product.save();

  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.deleteProduct(productId);

  res.redirect('/admin/products');
};
