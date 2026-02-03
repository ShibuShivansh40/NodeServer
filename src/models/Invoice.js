//const { Sequelize, DataTypes } = require('sequelize');
//const sequelize = new Sequelize({
//  dialect: 'sqlite',
//  storage: './database.sqlite',
//  logging: false
//});

//const Invoice = sequelize.define('Invoice', {
//  clientName: { type: DataTypes.STRING, allowNull: false },
//  refNo: { type: DataTypes.STRING },
//  date: { type: DataTypes.STRING },
//  items: { type: DataTypes.JSON },
//  total: { type: DataTypes.FLOAT }
//});


//const Invoice = sequelize.define('Invoice', {
//  refNo: {
//    type: DataTypes.STRING,
//    primaryKey: true,
//    allowNull: false
//  },
//  clientName: { type: DataTypes.STRING, allowNull: false },
//  date: { type: DataTypes.STRING }, // e.g., "01/01/2026"
//  items: { type: DataTypes.JSON },
//  total: { type: DataTypes.FLOAT }
//});


//module.exports = { Invoice, sequelize };

const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the central connection

const Invoice = sequelize.define('Invoice', {
  refNo: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  clientName: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING },
  items: { type: DataTypes.JSON },
  total: { type: DataTypes.FLOAT }
});

module.exports = Invoice;

