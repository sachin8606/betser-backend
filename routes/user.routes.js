const express = require('express');
const { registerUser, loginUser, addEmergencyContacts, getEmergencyContacts, deleteEmergencyContact, loginUserMobile, loginUserMail, verifyOtp, verifyOtpRegistrationMobile, updateUserDetailsHandler } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/loginMobile', loginUserMobile);
router.post('/verifyRegOtpMobile', verifyOtpRegistrationMobile);
router.post('/verifyOtp',verifyOtp);
router.post('/update',updateUserDetailsHandler);
router.post('/loginMail', loginUserMail);
router.post('/add-emergency-contact', authenticate, addEmergencyContacts);
router.post('/emergency-contacts', authenticate, getEmergencyContacts);
router.post('/delete-emergency-contact', authenticate, deleteEmergencyContact);

module.exports = router;
