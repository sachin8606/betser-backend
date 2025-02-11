const express = require('express');
const multer = require('multer'); // For handling media uploads
const { createMessage, getMessagesBetweenUsers, getMessagesForUser, getUsersListChat, uploadFile } = require('../controllers/communication.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { s3Upload } = require('../utils/s3Upload.utils');

const router = express.Router();
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024
  },
});

router.post('/create',authenticate, createMessage);
router.get('/between/:userId1/:userRole1/:userId2/:userRole2',authenticate, getMessagesBetweenUsers);
router.get('/user/:userId/:userRole',authenticate, getMessagesForUser);
router.get('/userListChat', authenticate,getUsersListChat );
router.post('/upload',authenticate, upload.single("file"),uploadFile)

module.exports = router;
