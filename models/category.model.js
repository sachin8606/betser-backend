const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize'); // Assuming you have a Sequelize instance configured

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure the name is unique
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL supports arrays natively
    allowNull: false,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = Category;
