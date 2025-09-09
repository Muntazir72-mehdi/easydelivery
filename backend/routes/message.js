const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with auth middleware
router.use(authMiddleware);

// Send a message
router.post('/', messageController.sendMessage);

// Get messages
router.get('/', messageController.getMessages);

// Get message threads
router.get('/threads', messageController.getMessageThreads);

// Mark messages as read
router.post('/mark-read', messageController.markAsRead);

// Get common message templates
router.get('/common', messageController.getCommonMessages);

module.exports = router;
