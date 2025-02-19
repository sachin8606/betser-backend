const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { roleAuthentication } = require('../middlewares/role.middleware');
const { createSettingFun, getSettingFun, updateSettingsFun } = require('../controllers/setting.controller');
const router = express.Router();

router.post('/create', authenticate,roleAuthentication(["supportAdmin","superAdmin"]),createSettingFun );
router.get('/', authenticate,getSettingFun );
router.put('/update/:id', authenticate,roleAuthentication(["supportAdmin","superAdmin"]),updateSettingsFun );
module.exports = router;
