const Notification = require('../../models/notifications.model');
const { Op } = require('sequelize');

// Create a new message
exports.createNotification = async (data) => {
    return await Notification.create(data);
};

// Get all notifications
exports.getNotifications = async ({filters = {}, page = 1, limit = 1}) => {
    const offset = (page - 1) * limit;
    const result = await Notification.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset
    });
    
  return {
    totalPages: Math.ceil(result.count / limit),
    currentPage: page,
    notifications: result.rows,
  };
};

// Get notification for specific user
exports.getNotificationsForUser = async (userId,{filters = {}, page = 1, limit = 1}) => {
    const result =  await Notification.findAndCountAll({
        where: {
           senderId:userId
        },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });
        
  return {
    totalPages: Math.ceil(result.count / limit),
    currentPage: page,
    notifications: result.rows,
  };
};

// Update notification
exports.updateNotification = async(id,newData) => {
    const notification = await Notification.findByPk(id);
    if(!notification){
      throw new Error('Notification not found.')
    }
    await notification.update(newData);
    return notification;
  }
