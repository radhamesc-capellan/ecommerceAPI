const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Cart = sequelize.define('cart', {
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

  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  }
});

module.exports = { Cart };
