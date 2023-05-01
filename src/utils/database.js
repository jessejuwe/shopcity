const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'root', '$@Admin7@$', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
