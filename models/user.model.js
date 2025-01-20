const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../db/sequelize');
const EmergencyContact = require('./emergencyContact.model');

const User = sequelize.define('User', {
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryCode:{
    type:DataTypes.INTEGER,
    allowNull:false,
    defaultValue:91
  },
  nickName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

User.hasMany(EmergencyContact, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
EmergencyContact.belongsTo(User, {
  foreignKey: 'userId',
});


module.exports = User;
