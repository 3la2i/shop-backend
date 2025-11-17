const express = require('express');
const router = express.Router();
const { login } = require('../Controller/auth');
const authMiddleware = require('../middleware');
// POST /api/auth/login
router.post('/login', login);

module.exports = router;