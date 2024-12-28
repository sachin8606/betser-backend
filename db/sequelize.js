// config/sequelize.js
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres', // Specify PostgreSQL as the dialect
  logging: console.log, // Optional: Set to `false` to disable SQL query logging
});

const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Test the connection
    console.log('Database connected successfully');
    await sequelize.sync({ alter: true });
    console.log('All models synchronized successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

connectDB();

module.exports = sequelize;
