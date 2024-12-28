const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize'); // Import the Sequelize instance
const Admin = require('./admin.model'); // Import the Admin model
const User = require('./user.model'); // Import the User model

const CommunicationLog = sequelize.define('CommunicationLog', {
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin, // Reference to the Admin model
      key: 'id', // The field in the Admin model to reference
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Reference to the User model
      key: 'id', // The field in the User model to reference
    },
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true, // Message is optional
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Media URL is optional
  },
  type: {
    type: DataTypes.ENUM('SMS', 'Push'),
    allowNull: false, // Type is required
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = CommunicationLog;
