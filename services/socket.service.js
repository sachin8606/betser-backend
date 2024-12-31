const Message = require('../models/communication.model');

const users = {};

const socketService = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('register', (userId) => {
      users[userId] = socket.id;
      console.log(`User registered with ID: ${userId}`);
    });

    socket.on('sendMessage', async (data) => {
      const { senderId, receiverId, message, mediaUrl } = data;

      try {
        const savedMessage = await Message.create({
          senderId,
          receiverId,
          message,
          mediaUrl,
        });

        const receiverSocketId = users[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', savedMessage);
        } else {
          console.log(`Receiver ${receiverId} is not connected`);
        }
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          console.log(`User disconnected: ${userId}`);
          break;
        }
      }
    });
  });
};

module.exports = socketService;
