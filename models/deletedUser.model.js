const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const DeletedUser = sequelize.define('DeletedUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  nickName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
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

module.exports = DeletedUser;
