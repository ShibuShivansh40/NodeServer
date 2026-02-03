const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Referencing your existing db.js [file:57]

const Client = sequelize.define('Client', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Client;
