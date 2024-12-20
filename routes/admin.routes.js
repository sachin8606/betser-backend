const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {login, register, getUserDetailsHandler, exportUsers, getHelpRequests, sendNotification,acknowledgeHelpRequestHandler, searchUsersHandler} = require('../controllers/admin.controller');

router.post('/login', login);
router.post('/register', register);
router.get('/users', authenticate, searchUsersHandler);
router.post('/users/export', authenticate, exportUsers);
router.get('/users/:id', authenticate, getUserDetailsHandler);
router.post('/notifications/send', authenticate, sendNotification);
router.get('/help-requests', authenticate, getHelpRequests);
router.post('/help-requests/acknowledge', authenticate, acknowledgeHelpRequestHandler);

module.exports = router;
