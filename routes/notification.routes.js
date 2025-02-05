const express = require('express');

const { authenticate } = require('../middlewares/auth.middleware');
const { createNotification, getNotifications, getNotificationForUser } = require('../controllers/notification.controller');

const router = express.Router();
router.post('/getNotifications',authenticate, getNotifications);
router.get('/getNotificationsUser',authenticate, getNotificationForUser);

module.exports = router;
