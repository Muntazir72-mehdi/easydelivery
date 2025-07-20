const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Protect all routes with auth middleware
router.use(authMiddleware);

// Get all delivery requests for logged-in user
router.get('/', deliveryController.getDeliveryRequests);

// Create a new delivery request
router.post('/', deliveryController.createDeliveryRequest);

// Update a delivery request by id
router.put('/:id', deliveryController.updateDeliveryRequest);

// Delete a delivery request by id
router.delete('/:id', deliveryController.deleteDeliveryRequest);

module.exports = router;
