const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../db/sequelize'); // Assuming you have the sequelize instance

const Admin = sequelize.define('Admin', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fcm_token:{
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'supportAdmin',
    validate: {
      isIn: [['superAdmin', 'supportAdmin']], // Validate the role field
    },
  },
}, {
  timestamps: true,
});

// Hash password before saving
Admin.beforeCreate(async (admin) => {
  if (admin.password) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
});

// Compare password for authentication
Admin.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = Admin;
