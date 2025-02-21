const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Settings = sequelize.define('Setting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  help_care_number: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  learnUrl:{
    type: DataTypes.STRING, 
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Settings;
