const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const User = require('./user.model');
const Requests = sequelize.define('Request', {
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
    type: DataTypes.ENUM('pending','progress','resolved','failed'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

Requests.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Requests, { foreignKey: 'userId' });

module.exports = Requests;
