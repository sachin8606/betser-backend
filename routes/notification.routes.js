const express = require('express');

const { authenticate } = require('../middlewares/auth.middleware');
const { getNotifications, getNotificationForUser, updateNotification } = require('../controllers/notification.controller');
const { roleAuthentication } = require('../middlewares/role.middleware');
const router = express.Router();
router.post('/getNotifications',authenticate, getNotifications);
router.get('/getNotificationsUser',authenticate, getNotificationForUser);
router.put('/:id',authenticate,roleAuthentication(["supportAdmin","superAdmin"]),updateNotification)

module.exports = router;
