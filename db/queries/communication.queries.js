const CommunicationLog = require('../models/communication.model');
const { Op } = require('sequelize');

// Create a new message
exports.createMessage = async (messageData) => {
    return await CommunicationLog.create(messageData);
};

// Get all messages between two users
exports.getMessagesBetweenUsers = async (userId1, userRole1, userId2, userRole2) => {
    return await CommunicationLog.findAll({
        where: {
            [Op.or]: [
                { senderId: userId1, senderRole: userRole1, receiverId: userId2, receiverRole: userRole2 },
                { senderId: userId2, senderRole: userRole2, receiverId: userId1, receiverRole: userRole1 },
            ],
        },
        order: [['createdAt', 'ASC']],
    });
};

// Get all messages for a specific user
exports.getMessagesForUser = async (userId, userRole) => {
    return await CommunicationLog.findAll({
        where: {
            [Op.or]: [
                { senderId: userId, senderRole: userRole },
                { receiverId: userId, receiverRole: userRole },
            ],
        },
        order: [['createdAt', 'DESC']],
    });
};
