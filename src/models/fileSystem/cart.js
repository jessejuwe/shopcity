const path = require('path');
const fs = require('fs');

const rootDir = require('../../utils/path');

const dir = path.join(rootDir, 'src/data', 'cart.json');

const saveCartData = data => {
  fs.writeFile(dir, JSON.stringify(data), err => console.log(err));
};

const fetchCartData = (id, price) => {
  fs.readFile(dir, (error, data) => {
    let cart;

    cart = !error ? JSON.parse(data) : { products: [], totalPrice: 0 };

    // Analyze the cart ==> find existing product
    const existingProductIndex = cart.products.findIndex(
      item => item.id === id
    );
    const existingProduct = cart.products[existingProductIndex];
    let updatedProduct;

    // Increase total quantity
    if (existingProduct) {
      updatedProduct = { ...existingProduct };
      updatedProduct.qty += 1;

      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updatedProduct; // replacing existing product
    } else {
      updatedProduct = { id, qty: 1 };
      cart.products = [...cart.products, updatedProduct]; // adding updatedProduct
    }

    // Increase total price
    cart.totalPrice += +price;

    // Save updated cart data
    saveCartData(cart);
  });
};

module.exports = class Cart {
  static addProduct(id, price) {
    // Add to cart or Update existing cart
    fetchCartData(id, price);
  }

  static deleteProduct(id, price) {
    // Delete item from cart
    fs.readFile(dir, (error, data) => {
      if (error) return;

      const cart = JSON.parse(data);

      const updatedCart = { ...cart };

      const product = updatedCart.products.find(item => item.id === id);

      if (!product) return;

      const productQty = product.qty;

      updatedCart.products = updatedCart.products.filter(
        item => item.id !== product.id
      );
      updatedCart.totalPrice -= price * productQty;

      // Save updated cart data
      saveCartData(updatedCart);
    });
  }

  static getCart(callback) {
    fs.readFile(dir, (error, data) => {
      if (!error) {
        const cartData = JSON.parse(data);

        callback(cartData);
      } else {
        callback([]);
      }
    });
  }
};
