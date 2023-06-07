const Sequelize = require('sequelize');

const sequelize = require('../../utils/database');

const config = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

const User = sequelize.define('user', config);

module.exports = User;
