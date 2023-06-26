const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dataShape = {
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  tokenExpiration: Date,
  cart: {
    items: [
      {
        // prettier-ignore
        productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
};

const userSchema = new Schema(dataShape);

userSchema.methods.addToCart = function (product) {
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
    // if product item does not exists in cart, add new product item to cart
    const newItem = { productID: product._id, quantity: newQty };
    updatedCartItems.push(newItem);
  }

  // represents the users modified cart
  const updatedCart = { items: updatedCartItems };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function (productID) {
  const updatedCartItems = this.cart.items.filter(
    item => item.productID.toString() !== productID.toString()
  );

  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };

  return this.save();
};

module.exports = mongoose.model('User', userSchema);
