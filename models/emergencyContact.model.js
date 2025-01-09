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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
}, {
  timestamps: false,
});

module.exports = EmergencyContact;
