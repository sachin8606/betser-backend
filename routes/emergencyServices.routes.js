const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { getEmergencyServices, createEmergencyService, deleteEmergencyService, updateEmergencyService, findEmergencyServices } = require('../controllers/emergencyService.controller');
const { roleAuthentication } = require('../middlewares/role.middleware');


router.post('/', authenticate, getEmergencyServices);
router.post('/create', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), createEmergencyService);
router.post('/findServices',authenticate,findEmergencyServices);
router.post('/update', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), updateEmergencyService);
router.delete('/:id', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), deleteEmergencyService);

module.exports = router;