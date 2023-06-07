const mongoDB = require('mongodb');

const client = require('../../utils/database');

const getDB = client.getDB;

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    const db = getDB();

    return db
      .collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDB();

    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDB();

    return db
      .collection('products')
      .find({ _id: new mongoDB.ObjectId(prodId) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
