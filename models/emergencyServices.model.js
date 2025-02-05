const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const EmergencyServices = sequelize.define('EmergencyServices', {
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  timestamps: false,
});

module.exports = EmergencyServices;
