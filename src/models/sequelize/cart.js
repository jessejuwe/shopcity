const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const config = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
};

const Cart = sequelize.define('cart', config);

module.exports = Cart;
