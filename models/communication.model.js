const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize'); // Import the Sequelize instance

const Communication = sequelize.define('Communication', {
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID of the sender (can be an Admin or User)',
  },
  senderRole: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Role of the sender',
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID of the receiver (can be an Admin or User)',
  },
  receiverRole: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Role of the receiver',
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Text message sent',
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL of the media sent (if any)',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of communication',
  },
}, {
  timestamps: true,
  comment: 'Log of communications between Admins and Users',
});

module.exports = Communication;