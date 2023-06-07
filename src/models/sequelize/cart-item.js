const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const config = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
};

const CartItem = sequelize.define('cart_item', config);

module.exports = CartItem;
