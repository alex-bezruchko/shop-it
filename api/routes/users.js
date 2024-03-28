const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', UserController.profile);
router.post('/logout', UserController.logout);

module.exports = router;
