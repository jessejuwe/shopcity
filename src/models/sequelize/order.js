const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const config = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
};

const Order = sequelize.define('order', config);

module.exports = Order;
