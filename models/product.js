const path = require('path');
const fs = require('fs');

const rootDir = require('../utils/path');

const dir = path.join(rootDir, 'data', 'products.json');

const fetchProductsData = callback => {
  fs.readFile(dir, (error, data) => {
    error ? callback([]) : callback(JSON.parse(data));
  });
};

const fetchProductDetail = (id, callback) => {
  fs.readFile(dir, (error, data) => {
    if (error) {
      callback([]);
    } else {
      const product = JSON.parse(data);
      const productItem = product.filter(item => item.id === id);
      callback(productItem[0]);
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    this.id = Math.random().toString();
    fetchProductsData(products => {
      products.push(this);

      fs.writeFile(dir, JSON.stringify(products), err => console.log(err));
    });
  }

  static fetchAll(callback) {
    fetchProductsData(callback);
  }

  static fetchProduct(id, callback) {
    fetchProductDetail(id, callback);
  }
};
