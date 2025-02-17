const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const EmergencyContact = sequelize.define('EmergencyContact', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
}, {
  timestamps: true,
});

module.exports = EmergencyContact;
