const mongoDB = require('mongodb');

const client = require('../../utils/database');

const ObjectId = mongoDB.ObjectId;
const getDB = client.getDB;

class User {
  constructor(username, password, cart, _id) {
    this.username = username;
    this.password = password;
    this.cart = cart; // {items: []}
    this._id = _id;
  }

  static findById(userId) {
    // retrieving database client from MongoDB
    const db = getDB();

    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => console.log(err));
  }

  save() {
    // retrieving database client from MongoDB
    const db = getDB();

    // check if user exists
    return db
      .collection('users')
      .findOne({ username })
      .then(user => {
        if (user) {
          console.log('User already exist.'); // TODO: remove log
          return;
        }

        // add new user
        return db
          .collection('users')
          .insertOne(this)
          .then(result => console.log(result)); // TODO: remove log
      })
      .catch(err => console.log(err));
  }

  getCart() {
    // retrieving database client from MongoDB
    const db = getDB();

    const productIDs = this.cart.items.map(item => item.productID);

    return db
      .collection('products')
      .find({ _id: { $in: productIDs } })
      .toArray()
      .then(products => {
        return products.map(product => ({
          ...product,
          quantity: this.cart.items.find(
            item => item.productID.toString() === product._id.toString()
          ).quantity,
        }));
      })
      .catch(err => console.log(err));
  }

  addToCart(product) {
    // retrieving database client from MongoDB
    const db = getDB();
    const filter = { _id: new ObjectId(this._id) };

    // checking if particular product item exists in cart
    // and finding the index in the items array
    const cartProductIndex = this.cart.items.findIndex(item => {
      return item.productID.toString() === product._id.toString();
    });

    let newQty = 1;
    const updatedCartItems = [...this.cart.items]; // clone the cart items

    if (cartProductIndex >= 0) {
      // if product item exists in cart, update the quantity by 1
      newQty = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQty;
    } else {
      // prettier-ignore
      // if product item does not exists in cart, add new product item to cart
      const newItem = { productID: new ObjectId(product._id), quantity: newQty };
      updatedCartItems.push(newItem);
    }

    // represents the users modified cart
    const updatedCart = { items: updatedCartItems };

    return db
      .collection('users')
      .updateOne(filter, { $set: { cart: updatedCart } })
      .then(() => {})
      .catch(err => console.log(err));
  }

  removeFromCart(productID) {
    // retrieving database client from MongoDB
    const db = getDB();
    const filter = { _id: new ObjectId(this._id) };

    const updatedCartItems = this.cart.items.filter(
      item => item.productID.toString() !== productID.toString()
    );

    return db
      .collection('users')
      .updateOne(filter, { $set: { cart: { items: updatedCartItems } } })
      .then(result => console.log(result)) // TODO: remove log
      .catch(err => console.log(err));
  }

  addOrder() {
    // retrieving database client from MongoDB
    const db = getDB();
    const filter = { _id: new ObjectId(this._id) };

    return this.getCart()
      .then(products => {
        const user = { username: this.username, _id: new ObjectId(this._id) };
        const priceArray = products.map(product => +product.price);

        // prettier-ignore
        const total = priceArray.reduce((prev, curr, index) => prev + curr, 0);
        const totalPrice = total.toString(10);

        const order = { products, user, totalPrice };

        return db.collection('orders').insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };

        return db
          .collection('users')
          .updateOne(filter, { $set: { cart: this.cart } });
      })
      .catch(err => console.log(err));
  }

  getOrders() {
    // retrieving database client from MongoDB
    const db = getDB();
    const filter = { 'user._id': new ObjectId(this._id) };

    return db
      .collection('orders')
      .find(filter)
      .toArray()
      .then(orders => {
        return orders;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;
