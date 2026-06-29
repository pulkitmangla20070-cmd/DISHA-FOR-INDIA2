const express = require('express');
const authController = require('./auth.controller');
const validateRegister = require('./register.validation');
const validateLogin = require('./login.validation');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

module.exports = router;
