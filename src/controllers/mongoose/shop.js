const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../../models/mongoose/product'); // importing the Product model
const Order = require('../../models/mongoose/order'); // importing the Order model

exports.getIndex = (req, res, next) => {
  const ITEMS_PER_PAGE = 2;
  const activePage = +req.query.page || 1;
  let totalProducts;

  // Fetching data using Mongoose
  Product.find()
    .countDocuments()
    .then(numProd => {
      totalProducts = numProd;

      return Product.find()
        .skip((activePage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop City',
        path: '/',
        hasProducts: products.length > 0,
        shopIsActive: req.url === '/' ? 'active' : '',
        activePage,
        hasPrevPage: activePage > 1,
        hasNextPage: ITEMS_PER_PAGE * activePage < totalProducts,
        prevPage: activePage - 1,
        nextPage: activePage + 1,
        firstPage: 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const ITEMS_PER_PAGE = 3;
  const activePage = +req.query.page || 1;
  let totalProducts;

  // Fetching data using Mongoose
  Product.find()
    .countDocuments()
    .then(numProd => {
      totalProducts = numProd;

      return Product.find()
        .skip((activePage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
        activePage,
        hasPrevPage: activePage > 1,
        hasNextPage: ITEMS_PER_PAGE * activePage < totalProducts,
        prevPage: activePage - 1,
        nextPage: activePage + 1,
        firstPage: 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  // Fetching using Mongoose
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productID')
    .then(user => {
      const products = user.cart.items;

      res.render('shop/cart', {
        products,
        hasProducts: products.length > 0,
        pageTitle: 'Your Cart',
        path: '/cart',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;

  Product.findById(id)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.postDeleteCartProduct = (req, res, next) => {
  const _id = req.body.productId;

  req.user
    .removeFromCart(_id)
    .then(() => res.redirect('/cart'))
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userID': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        orders,
        hasOrders: orders.length > 0,
        pageTitle: 'Your Order',
        path: '/orders',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate('cart.items.productID')
    .then(userInfo => {
      const email = req.user.email;
      const userID = req.user._id;
      const user = { email, userID };

      const products = userInfo.cart.items.map(item => ({
        product: { ...item.productID._doc },
        quantity: item.quantity,
      }));

      const totalPrice = products
        .map(item => item.product.price * item.quantity)
        .reduce((prev, curr, index) => prev + curr, 0);

      const order = new Order({ products, user, totalPrice });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate('cart.items.productID')
    .then(user => {
      const products = user.cart.items;
      let totalSum = 0;

      products.forEach(product => {
        totalSum += product.quantity * product.productID.price;
      });

      res.render('shop/checkout', {
        products,
        hasProducts: products.length > 0,
        pageTitle: 'Checkout',
        path: '/checkout',
        totalSum,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join('data', 'invoices', invoiceName);

  Order.findById(orderId)
    .then(order => {
      if (!order) return next(new Error('Order not found'));

      if (order.user.userID.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized access'));
      }

      // preloading data in memory (bad for large files)
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) return next(err);

      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`); //prettier-ignore
      //   res.send(data);
      // });

      const doc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`); //prettier-ignore

      // streaming data directly to the server
      doc.pipe(fs.createWriteStream(invoicePath));
      // streaming data directly to the client-side
      doc.pipe(res);

      // creating the pdf document
      doc.fontSize(11).text(`Order: #${orderId}`);
      doc.moveDown();

      order.products.forEach(item => {
        doc.fontSize(24).text(
          // prettier-ignore
          `${item.product.title} (${item.quantity}): $${item.product.price.toFixed(2)}`
        );
        doc.moveDown();
      });

      doc.fontSize(14).text(`Sum: $${order.totalPrice.toFixed(2)}`);

      doc.end();
    })
    .catch(err => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};
