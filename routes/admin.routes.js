const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { register, getUserDetailsHandler, exportUsers, getHelpRequests, sendNotification,acknowledgeHelpRequestHandler, searchUsersHandler, updateUserDetailsHandler, login, getAdminDetails} = require('../controllers/admin.controller');

router.post('/login', login);
router.post('/register', register);
router.get('/details', authenticate, getAdminDetails);
router.get('/users', authenticate, searchUsersHandler);
router.post('/user/edit',authenticate,updateUserDetailsHandler);
router.post('/export/users', authenticate, exportUsers);
router.get('/users/:id', authenticate, getUserDetailsHandler);
router.post('/notifications/send', authenticate, sendNotification);
router.post('/help-requests', authenticate, getHelpRequests);
router.post('/help-requests/acknowledge', authenticate, acknowledgeHelpRequestHandler);

module.exports = router;