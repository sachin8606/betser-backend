const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
require('./db/sequelize');

// Routes
const userRoutes = require('./routes/user.routes');
const requestRoutes = require('./routes/request.routes');
const adminRoutes = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes'); 

app.use('/api/user', userRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/category', categoryRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
