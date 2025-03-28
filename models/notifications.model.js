const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Users = require('./user.model')

const Notifications = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
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

Notifications.belongsTo(Users, { foreignKey: 'userId',onDelete: 'CASCADE'  });
Users.hasMany(Notifications, { foreignKey: 'userId' });

module.exports = Notifications;
