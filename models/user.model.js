const { DataTypes, UUIDV4 } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../db/sequelize');
const EmergencyContact = require('./emergencyContact.model');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  countryCode:{
    type:DataTypes.INTEGER,
    allowNull:true,
  },
  device:{
    type:DataTypes.STRING,
    allowNull:true
  },
  nickName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique:true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  avatar:{
    type:DataTypes.STRING,
    allowNull:true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isMobileVerified:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isEmailVerified:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
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
