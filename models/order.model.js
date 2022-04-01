const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Order = sequelize.define('order', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  issuedAt: {
    type: DataTypes.STRING,
    allowNull: false
  },

  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  }
});

module.exports = { Order };
