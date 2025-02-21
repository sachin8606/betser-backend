const express = require('express');
const {
  createAlert,
  getUserAlerts,
  getAlertById,
  upsertAlert,
  markAlertAsRead,
  deleteAlertsByType,
  deleteAlertById,
  getAllAlerts,
} = require('../controllers/alert.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { roleAuthentication } = require('../middlewares/role.middleware');
const router = express.Router();

router.get('/', authenticate, getUserAlerts);
router.post('/getAlerts',authenticate,getAllAlerts)
router.get('/:alertId', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), getAlertById);
router.put('/:alertId/read', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), markAlertAsRead);
router.delete('/', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), deleteAlertsByType);
router.delete('/:alertId', authenticate,roleAuthentication(["supportAdmin","superAdmin"]), deleteAlertById);
module.exports = router;
