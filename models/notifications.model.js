const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Users = require('./user.model')

const Notifications = sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Text message sent',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('unread','read'),
    defaultValue: 'unread',
  },
}, {
  timestamps: true,
});

Notifications.belongsTo(Users, { foreignKey: 'userId' });
Users.hasMany(Notifications, { foreignKey: 'userId' });

module.exports = Notifications;
