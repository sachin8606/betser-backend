const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tag:{
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Category ;
