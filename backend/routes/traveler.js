const express = require('express');
const router = express.Router();
const travelerController = require('../controllers/travelerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all routes with auth middleware
router.use(authMiddleware);

// Get all trips for logged-in traveler (Travelers only)
router.get('/', roleMiddleware(['Traveler']), travelerController.getTravelerTrips);

// Create a new traveler trip (Travelers only)
router.post('/', roleMiddleware(['Traveler']), travelerController.createTravelerTrip);

// Update a traveler trip by id (Travelers only)
router.put('/:id', roleMiddleware(['Traveler']), travelerController.updateTravelerTrip);

// Delete a traveler trip by id (Travelers only)
router.delete('/:id', roleMiddleware(['Traveler']), travelerController.deleteTravelerTrip);

// Get all active trips (for matching) (Travelers only)
router.get('/active/all', roleMiddleware(['Traveler']), travelerController.getActiveTrips);

module.exports = router;
