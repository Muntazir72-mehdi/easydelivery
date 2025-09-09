const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

// Get wallet for current user
router.get('/', authMiddleware, walletController.getWallet);

// Add transaction to wallet
router.post('/transaction', authMiddleware, walletController.addTransaction);

module.exports = router;
