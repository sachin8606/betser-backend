const express = require('express');
const multer = require('multer'); // For handling media uploads
const { createMessage, getMessagesBetweenUsers, getMessagesForUser } = require('../controllers/communication.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();
const upload = multer(); 
router.post('/create',authenticate, upload.single('media'), createMessage);
router.get('/between/:userId1/:userRole1/:userId2/:userRole2',authenticate, getMessagesBetweenUsers);
router.get('/user/:userId/:userRole',authenticate, getMessagesForUser);

module.exports = router;
