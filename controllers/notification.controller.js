const notificationQueries = require('../db/queries/notification.queries');

exports.createNotification = async (req, res) => {
    const { senderId, receiverId, message, title,status } = req.body;
    try {
        const notificationData = {
            senderId,
            receiverId,
            message,
            title,
            status,
        };

        const newNotification = await notificationQueries.createNotification(notificationData);
        res.status(201).json({ message: "Notification created", data: newNotification });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Get all notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await notificationQueries.getNotifications(req.body.filter);
        res.status(200).json({ message: "Fetched successfully", data: notifications });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Get all notification for a specific user
exports.getNotificationForUser = async (req, res) => {
    const { userId,filter } = req.body;

    try {
        const messages = await notificationQueries.getNotificationsForUser(userId,filter);
        res.status(200).json({ message: "Fetched successfully", data: messages });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Update
exports.updateNotification = async (req, res) =>{
    const { id,data } = req.body;

    try {
        const notification = await notificationQueries.updateNotification(userId,data);
        res.status(200).json({ message: "Updated successfully", notification:  notification });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
}
