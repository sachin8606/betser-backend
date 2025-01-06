const Message = require('../models/communication.model');

const users = {}; // Store users and their corresponding socket IDs

const socketService = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user registration
    socket.on('register', ({ userId, role }) => {
      users[`${role}:${userId}`] = socket.id;
      console.log(`User registered: ${role}:${userId}`);
      io.emit('userStatus', `${role} connected`);
      console.log(users)
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      const { senderId, senderRole, receiverId, receiverRole, message, mediaUrl,type } = data;

      try {
        // Save the message in the database
        const savedMessage = await Message.create({
          senderId,
          senderRole,
          receiverId,
          receiverRole,
          message,
          mediaUrl,
          type
        });

        // Emit the message to the receiver if they are online
        const receiverSocketId = users[`${receiverRole}:${receiverId}`];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', savedMessage);
        } else {
          console.log(`Receiver ${receiverRole}:${receiverId} is not online.`);
        }
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const disconnectedUser = Object.keys(users).find(
        (key) => users[key] === socket.id
      );
      if (disconnectedUser) {
        delete users[disconnectedUser];
        console.log(`User disconnected: ${disconnectedUser}`);
      }
    });
  });
};

module.exports = socketService;
