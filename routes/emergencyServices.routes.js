const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { getEmergencyServices, createEmergencyService, deleteEmergencyService, updateEmergencyService } = require('../controllers/emergencyService.controller');
const { roleAuthentication } = require('../middlewares/role.middleware');


router.post('/', authenticate, getEmergencyServices);
router.post('/create', authenticate, createEmergencyService);
router.post('/update', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), updateEmergencyService);
router.delete('/:id', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), deleteEmergencyService);

module.exports = router;