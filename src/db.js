const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Match your current path [file:64]
  logging: false
});

module.exports = sequelize;
