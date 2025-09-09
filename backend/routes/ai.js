const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect routes with auth middleware
router.use(authMiddleware);

// Smart match suggestions endpoint
router.get('/smart-match', aiController.smartMatch);

// AI question answering endpoint
router.post('/ask', aiController.askAI);

module.exports = router;
