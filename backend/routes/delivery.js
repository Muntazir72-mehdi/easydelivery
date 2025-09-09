const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, deliveryController.getAll);
router.post('/', authMiddleware, deliveryController.create);
router.get('/:id', authMiddleware, deliveryController.getById);
router.put('/:id', authMiddleware, deliveryController.update);
router.delete('/:id', authMiddleware, deliveryController.delete);

// New route for updating delivery status
router.patch('/:id/status', authMiddleware, deliveryController.updateStatus);

// New routes for history and analytics
router.get('/history', authMiddleware, deliveryController.getHistory);
router.get('/analytics', authMiddleware, deliveryController.getAnalytics);

// Smart match suggestions
router.get('/smart-matches', authMiddleware, deliveryController.getSmartMatches);

module.exports = router;
