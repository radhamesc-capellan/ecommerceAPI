const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Product = sequelize.define('product', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false
  },

  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = { Product };
