const Product = require('../../models/sequelize/product');

exports.getIndex = (req, res, next) => {
  // Fetching data using MySQL (Sequelize)
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'ShopCity',
        path: '/',
        hasProducts: products.length > 0,
        shopIsActive: req.url === '/' ? 'active' : '',
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Fetching data using MySQL (Sequelize)
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  // Fetching using MySQL (Sequelize)
  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => console.log(err));

  // Alternative
  // Product.findAll({ where: { id: productId } })
  //   .then(result => {
  //     res.render('shop/product-detail', {
  //       product: result[0],
  //       pageTitle: result[0].title,
  //       path: '/products',
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart =>
      cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            products,
            hasProducts: products.length > 0,
            pageTitle: 'Your Cart',
            path: '/cart',
          });
        })
        .catch(err => console.log(err))
    )
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id } });
    })
    .then(products => {
      let product;

      if (products.length > 0) product = products[0];

      if (product) {
        const oldQty = product.cart_item.quantity;
        newQuantity = oldQty + 1;

        return product;
      }

      return Product.findByPk(id);
    })
    .then(product =>
      fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    )
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postDeleteCartProduct = (req, res, next) => {
  const id = req.body.productId;

  req.user
    .getCart()
    .then(cart => cart.getProducts({ where: { id } }))
    .then(products => {
      const product = products[0];
      return product.cart_item.destroy();
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders =>
      res.render('shop/orders', {
        orders,
        hasOrders: orders.length > 0,
        pageTitle: 'Your Order',
        path: '/orders',
      })
    )
    .catch(err => console.log(err));
};

exports.postOrders = (req, res, next) => {
  let fetchedCart;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products =>
      req.user
        .createOrder()
        .then(order =>
          order.addProducts(
            products.map(product => {
              product.order_item = { quantity: product.cart_item.quantity };
              return product;
            })
          )
        )
        .then(() => fetchedCart.setProducts(null))
        .then(() => res.redirect('/orders'))
        .catch(err => console.log(err))
    )
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
