const express = require('express');
const { createRequest, getRequests, updateRequest } = require('../controllers/request.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { roleAuthentication } = require('../middlewares/role.middleware');
const router = express.Router();

router.post('/create', authenticate, createRequest);
router.post('/', authenticate, getRequests);
router.post('/update', authenticate, roleAuthentication(["supportAdmin","superAdmin"]),updateRequest);
module.exports = router;
