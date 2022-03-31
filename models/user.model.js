const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const User = sequelize.define('user', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false
  },

  username: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  }
});

module.exports = { User };
