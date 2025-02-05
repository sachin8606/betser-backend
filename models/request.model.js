const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Request = sequelize.define('Request', {
  userId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: 'Users', key: 'id' },
  },
  type: {
    type: DataTypes.ENUM('Emergency', 'General'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending','progress','resolved'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = Request;
