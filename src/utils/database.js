// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node_complete', 'root', process.env.SQL_PASSWORD, {
//   dialect: 'mysql',
//   host: 'localhost',
// });

// module.exports = sequelize;

// ****************************************************************************
require('dotenv').config();
const mongoDB = require('mongodb');
const MongoClient = mongoDB.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(process.env.MONGO_CLIENT)
    .then(client => {
      console.log('Connected to MongoDB.');
      _db = client.db(); // connects to shopcity db
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDB = () => {
  if (!_db) throw 'No database found';
  return _db;
};

module.exports = { mongoConnect, getDB };
