const express = require('express');
const { createRequest, getRequests, getRequestById } = require('../controllers/request.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/create', authenticate, createRequest);
router.get('/', authenticate, getRequests);
router.get('/getById', authenticate, getRequestById);
module.exports = router;
