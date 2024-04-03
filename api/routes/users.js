const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', UserController.profile);
router.post('/logout', UserController.logout);
router.get('/all', UserController.getAll);
router.post('/send-request/:friendId', UserController.send);
router.post('/accept-request/:userId/:requesterId', UserController.accept);
router.post('/decline-request/:userId/:requesterId', UserController.decline);
router.get('/friends/:userId', UserController.friends);
router.get('/:userId/pending-requests', UserController.pendingRequests);

router.get('/user/:userId/places', UserController.places)
router.post('/user/:userId/places', UserController.addPlace)

module.exports = router;
