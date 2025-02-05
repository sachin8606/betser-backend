const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { register, getUserDetailsHandler, exportUsers, getHelpRequests, sendNotification,acknowledgeHelpRequestHandler, searchUsersHandler, updateUserDetailsHandler, login, getAdminDetails, updateAdmin} = require('../controllers/admin.controller');
const { roleAuthentication } = require('../middlewares/role.middleware');

router.post('/login', login);
router.post('/register', register);
router.get('/details', authenticate, getAdminDetails);
router.post('/update',authenticate,roleAuthentication(["supportAdmin","superAdmin"]),updateAdmin)
router.post('/users', authenticate, searchUsersHandler);
router.post('/user/edit',authenticate,updateUserDetailsHandler);
router.post('/export/users', authenticate, exportUsers);
router.get('/users/:id', authenticate, getUserDetailsHandler);
router.post('/notifications/send', authenticate, sendNotification);
router.post('/help-requests', authenticate, getHelpRequests);
router.post('/help-requests/acknowledge', authenticate, acknowledgeHelpRequestHandler);

module.exports = router;