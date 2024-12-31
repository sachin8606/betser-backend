const communicationQueries = require('../queries/communication.queries');
const s3Upload = require('../utils/s3Upload.utils'); 

// Create a new message
exports.createMessage = async (req, res) => {
    const { senderId, senderRole, receiverId, receiverRole, message, type } = req.body;
    let mediaUrl = null;

    try {
        // If media is present, upload to S3
        if (req.file) {
            mediaUrl = await s3Upload(req.file);
        }

        const messageData = {
            senderId,
            senderRole,
            receiverId,
            receiverRole,
            message,
            mediaUrl,
            type,
        };

        const newMessage = await communicationQueries.createMessage(messageData);
        res.status(201).json({ message: "Message created", data: newMessage });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Get all messages between two users
exports.getMessagesBetweenUsers = async (req, res) => {
    const { userId1, userRole1, userId2, userRole2 } = req.params;

    try {
        const messages = await communicationQueries.getMessagesBetweenUsers(userId1, userRole1, userId2, userRole2);
        res.status(200).json({ message: "Fetched successfully", data: messages });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Get all messages for a specific user
exports.getMessagesForUser = async (req, res) => {
    const { userId, userRole } = req.params;

    try {
        const messages = await communicationQueries.getMessagesForUser(userId, userRole);
        res.status(200).json({ message: "Fetched successfully", data: messages });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};
