const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware');
const { register , login } = require('../Controller/auth');
// POST /api/auth/login
router.post('/login', login);
router.post('/register', register);
module.exports = router;