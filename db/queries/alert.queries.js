const { Op } = require('sequelize');
const Alert = require('../../models/alert.model'); 

exports.createAlert = async (alertData) => {
  return await Alert.create(alertData);
};

exports.getAllAlerts = async (filter) => {
  return await Alert.findAll({
    where: filter, 
  });
};

exports.findAlertById = async (id) => {
  return await Alert.findByPk(id);
};

exports.updateAlertById = async (id, updatedData) => {
  const alert = await Alert.findByPk(id);
  if (!alert) {
    throw new Error('Alert not found');
  }

  Object.assign(alert, updatedData);
  await alert.save();
  return alert;
};

exports.deleteAlertById = async (id) => {
  const alert = await Alert.findByPk(id);
  if (!alert) {
    throw new Error('Alert not found.');
  }

  await alert.destroy();
  return alert;
};

exports.getUserAlerts = async (userId) => {
  return await Alert.findAll({
    where: { userId },
  });
};

exports.upsertAlert = async (userId, type, message) => {
  const [alert, created] = await Alert.findOrCreate({
    where: { userId, type },
    defaults: { message, isRead: false },
  });

  if (!created) {
    alert.message = message; 
    alert.isRead = false;
    await alert.save();
  }

  return alert;
};

exports.markAlertAsRead = async (id) => {
  const alert = await Alert.findByPk(id);
  if (!alert) {
    throw new Error('Alert not found');
  }

  alert.isRead = true;
  await alert.save();
  return alert;
};

exports.deleteAlertsByType = async (userId, type) => {
  return await Alert.destroy({
    where: {
      userId,
      type,
    },
  });
};

exports.getUnreadAlerts = async (userId) => {
  return await Alert.findAll({
    where: {
      userId,
      isRead: false,
    },
  });
};
