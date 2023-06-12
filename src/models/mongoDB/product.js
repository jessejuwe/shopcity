const mongoDB = require('mongodb');

const client = require('../../utils/database');

const getDB = client.getDB;

class Product {
  constructor(title, imageUrl, price, description, _id, userID) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this._id = _id ? new mongoDB.ObjectId(_id) : null;
    this.userID = userID;
  }

  save() {
    const db = getDB();
    let dbOp;

    if (this._id) {
      // update product
      const filter = { _id: this._id };
      dbOp = db.collection('products').updateOne(filter, { $set: this });
    } else {
      // insert new product
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp
      .then(result => {
        // TODO
        // remove log
        console.log(result);
      })
      .catch(err => console.log(err));
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
      .catch(err => console.log(err));
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
      .catch(err => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDB();

    return db
      .collection('products')
      .deleteOne({ _id: new mongoDB.ObjectId(prodId) })
      .then(() => console.log('Deleted.'))
      .catch(err => console.log(err));
  }
}

module.exports = Product;
