const Message = require('../models/communication.model');
const { s3Upload } = require('../utils/s3Upload.utils');

const users = {}; // Store users and their corresponding socket IDs

const socketService = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user registration
    socket.on('register', ({ userId, role }) => {
      const userKey = `${role}:${userId}`;
      users[userKey] = socket.id;
      console.log(`User registered: ${userKey}`);
      io.emit('userStatus', { message: `${role} connected`, userKey });
      console.log('Active users:', users);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data, callback) => {
      const { senderId, senderRole, receiverId, receiverRole, message, type, mediaFile } = data;
      let uploadRes;
      let mediaUrl = null;

      try {
        // Upload media to S3 if provided
        if (mediaFile) {
          // Assuming `mediaFile` is a buffer or file path from the frontend.
          uploadRes = await s3Upload(mediaFile);
          if (!uploadRes.msg === "success") {
            throw new Error("Failed to upload file.")
          }
          mediaUrl = uploadRes.data
        }

        // Save the message in the database
        const savedMessage = await Message.create({
          senderId,
          senderRole,
          receiverId,
          receiverRole,
          message,
          mediaUrl,
          type,
        });

        // Emit the message to the receiver if they are online
        const receiverKey = `${receiverRole}:${receiverId}`;
        const receiverSocketId = users[receiverKey];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', savedMessage);
        } else {
          console.log(`Receiver ${receiverKey} is not online.`);
        }

        // Acknowledge the sender
        callback({ status: 'success', message: 'Message sent successfully', data: savedMessage });
      } catch (error) {
        console.error('Error saving message:', error);
        // Error message with more context
        callback({ status: 'error', message: 'Failed to send message', error: error.message });
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      const disconnectedUser = Object.keys(users).find((key) => users[key] === socket.id);
      if (disconnectedUser) {
        delete users[disconnectedUser];
        console.log(`User disconnected: ${disconnectedUser}`);
      }
    });
  });
};

module.exports = socketService;
