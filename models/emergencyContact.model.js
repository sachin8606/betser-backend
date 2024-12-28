const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const EmergencyContact = sequelize.define('EmergencyContact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = EmergencyContact;
