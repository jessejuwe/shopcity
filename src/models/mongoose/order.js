const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dataShape = {
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: { type: String, required: true },
    userID: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  totalPrice: { type: Number, required: true },
};

const orderSchema = new Schema(dataShape);

module.exports = mongoose.model('Order', orderSchema);
