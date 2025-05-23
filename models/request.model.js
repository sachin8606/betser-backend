const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const User = require('./user.model');
const Requests = sequelize.define('Request', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique:true
  },
  userId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: 'Users', key: 'id' },
  },
  type: {
    type: DataTypes.ENUM('Emergency', 'General','SOS'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending','progress','resolved','failed','cancelled'),
    defaultValue: 'pending',
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mediaType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comments: { 
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  }
}, {
  timestamps: true,
});

Requests.belongsTo(User, { foreignKey: 'userId',onDelete: 'CASCADE'  });
User.hasMany(Requests, { foreignKey: 'userId' });

module.exports = Requests;
