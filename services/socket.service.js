const Message = require('../models/communication.model');
const { s3Upload } = require('../utils/s3Upload.utils');

const users = {};
const admins = {};

const socketService = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    //  user registration
    socket.on('register', ({ userId, role }) => {
      if (role === "admin") {
        admins[userId] = socket.id
        socket.emit("onlineUsers", Object.keys(users));
      }
      else {
        users[userId] = socket.id;
      }
      console.log(`User registered: ${userId}`);
      io.emit("userStatus", { userId, role, status: "online" });
      console.log('Active users:', users);
      console.log('Active admins:', admins)
    });

    // Handle sending messages
    socket.on('sendMessage', async (data, callback) => {
      const { senderId, senderRole, receiverId, receiverRole, message, type, mediaUrl } = data;

      try {

        // Save message
        const savedMessage = await Message.create({
          senderId,
          senderRole,
          receiverId,
          receiverRole,
          message,
          mediaUrl,
          type,
        });
        let receiverSocketId;
        if (receiverRole === "admin") {
          Object.values(admins).forEach((adminSocketId) => {
            io.to(adminSocketId).emit("receiveMessage", savedMessage);
          });
        }
        else {
          receiverSocketId = users[receiverId];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', savedMessage);
          } else {
            console.log(`Receiver ${receiverSocketId} is not online.`);
          }
        }
        if (typeof callback === "function") {
          callback({ status: "success", message: "Message sent successfully", data: savedMessage });
        }
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      const disconnectedUser = Object.keys(users).find((key) => users[key] === socket.id);
      if (disconnectedUser) {
        delete users[disconnectedUser];
        console.log(`User disconnected: ${disconnectedUser}`);
        io.emit("userStatus", { userId: disconnectedUser, role: "user", status: "offline" });
      }
    });
  });
};

module.exports = socketService;
