const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { Server } = require('socket.io');
const socketService = require('./services/socket.service');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// Routes
const userRoutes = require('./routes/user.routes');
const requestRoutes = require('./routes/request.routes');
const adminRoutes = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes');
const alertRoutes = require('./routes/alert.routes');
const emergencyServiceRoutes = require('./routes/emergencyServices.routes');
const notificationRoutes = require('./routes/notification.routes');
const communicationRoutes = require('./routes/communication.routes');
const deletedUserRoutes = require('./routes/deletedUser.routes');
const settingRoutes = require('./routes/setting.routes');
const { initializeCron } = require('./crons/emergencyContacts');

app.use('/api/user', userRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/alert', alertRoutes);
app.use('/api/emergencyService', emergencyServiceRoutes);
app.use('/api/notification',notificationRoutes)
app.use('/api/communication',communicationRoutes)
app.use('/api/deletedUser',deletedUserRoutes)
app.use('/api/settings',settingRoutes)

// Health Check
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket.IO Service
socketService(io);

// Initialize cron jobs
initializeCron()

// Start Server
server.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
