// config/sequelize.js
const { Sequelize } = require('sequelize');
let sequelize;
if (process.env.MODE === 'PRODUCTION') {
  // Create a new Sequelize instance
  sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Create a new Sequelize instance
  sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
  });
}



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
