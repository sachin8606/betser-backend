const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { getAllDeletedUsers, getDeletedUser } = require('../controllers/deletedUser.controller');
const { roleAuthentication } = require('../middlewares/role.middleware');

const router = express.Router();

router.post('/getUsers',authenticate,roleAuthentication(["supportAdmin","superAdmin"]),getAllDeletedUsers);
router.get('/:id',authenticate,roleAuthentication(["supportAdmin","superAdmin"]), getDeletedUser);
module.exports = router;
