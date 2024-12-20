const express = require('express');
const { registerUser, loginUser, addEmergencyContact, getEmergencyContacts, deleteEmergencyContact } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/add-emergency-contact', authenticate, addEmergencyContact);
router.post('/emergency-contacts', authenticate, getEmergencyContacts);
router.post('/delete-emergency-contact', authenticate, deleteEmergencyContact);

module.exports = router;
