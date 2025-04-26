const communicationQueries = require('../db/queries/communication.queries');
const { convertWebmToMp4 } = require('../utils/conversion.utils');
const { s3Upload } = require('../utils/s3Upload.utils');

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

exports.getUsersListChat = async (req, res) => {
    try {
        const users = await communicationQueries.getUserListChat();
        res.status(200).json({ message: "Fetched successfully", data: users });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message })
    }
}

exports.uploadFile = async (req, res) => {
    try {
      console.log("Received File:", req.file);
      console.log("Received Folder:", req.body.folder);
  
      if (!req.file) {
        return res.status(400).json({ status: "error", message: "No file uploaded" });
      }
  
      let fileBuffer = req.file.buffer;
      let fileName = req.file.originalname;
      let fileType = req.file.mimetype;
  
      // If the file is webm, convert it
      if (req.file.mimetype === 'video/webm') {
        console.log("Converting WEBM to MP4...");
        fileBuffer = await convertWebmToMp4(req.file.buffer);
        fileName = fileName.replace('.webm', '.mp4');
        fileType = 'video/mp4';
      }
  
      const file = {
        name: fileName,
        type: fileType,
        data: fileBuffer,
        folder: req.body.folder || "uploads",
      };
  
      const uploadResponse = await s3Upload(file);
  
      if (uploadResponse.msg !== "success") {
        throw new Error("S3 Upload Failed");
      }
  
      res.json({ status: "success", mediaUrl: uploadResponse.data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", message: error.message || error });
    }
  };
