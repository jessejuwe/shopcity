const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dataShape = {
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
};

const productSchema = new Schema(dataShape);

module.exports = mongoose.model('Product', productSchema);
