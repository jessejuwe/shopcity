const path = require('path');
const fs = require('fs');

const db = require('../utils/database');
const Cart = require('./cart');
const rootDir = require('../utils/path');

const dir = path.join(rootDir, 'src/data', 'products.json');

const fetchProductsData = callback => {
  fs.readFile(dir, (error, data) => {
    error ? callback([]) : callback(JSON.parse(data));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  // *********************** FILE SYSTEM FUNCTIONS **************************

  save() {
    fetchProductsData(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          item => item.id === this.id
        );

        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        // prettier-ignore
        fs.writeFile(dir, JSON.stringify(updatedProducts), err => console.log(err));
      } else {
        this.id = Math.random().toString();
        products.push(this);

        fs.writeFile(dir, JSON.stringify(products), err => console.log(err));
      }
    });
  }

  static fetchAll(callback) {
    fetchProductsData(callback);
  }

  static fetchProduct(id, callback) {
    fetchProductsData(products => {
      const product = products.find(item => item.id === id);
      callback(product);
    });
  }

  static deleteProduct(id) {
    fetchProductsData(products => {
      const product = products.find(item => item.id === id);
      const updatedProducts = products.filter(item => item.id !== id);

      fs.writeFile(dir, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        } else {
          console.log(err);
        }
      });
    });
  }

  // *********************** MYSQL FUNCTIONS **************************
  sqlSave() {
    return db.execute(
      'INSERT INTO products (title, imageUrl, price, description) VALUES (?, ?, ?, ?)',
      [this.title, this.imageUrl, this.price, this.description]
    );
  }

  static sqlFetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static sqlFetchProduct(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }

  static sqlDeleteProduct(id) {
    return db.execute('DELETE * FROM products WHERE products.id = ?', [id]);
  }
};
