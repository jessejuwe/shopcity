const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));

  const adminIsActive = req.url === '/add-product' ? 'active' : '';

  // prettier-ignore
  const options = { pageTitle: 'Add Product', path: '/admin/add-product', adminIsActive };

  res.render('admin/add-product', options);
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);
  product.save();

  res.redirect('/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products =>
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  );
};
