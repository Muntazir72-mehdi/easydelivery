const TravelerTrip = require('../models/TravelerTrip');

// Get all trips for a traveler
exports.getTravelerTrips = async (req, res) => {
  try {
    const userId = req.user._id;
    const trips = await TravelerTrip.find({ user: userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching trips' });
  }
};

// Create a new traveler trip
exports.createTravelerTrip = async (req, res) => {
  try {
    const userId = req.user._id;
    const { from, to, date, maxWeight, costPerKg, description } = req.body;

    const newTrip = new TravelerTrip({
      user: userId,
      from,
      to,
      date,
      maxWeight,
      availableWeight: maxWeight, // Initially available weight equals max weight
      costPerKg,
      description,
      status: 'Active'
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating trip' });
  }
};

// Update traveler trip
exports.updateTravelerTrip = async (req, res) => {
  try {
    const userId = req.user._id;
    const tripId = req.params.id;
    const updateData = req.body;

    const trip = await TravelerTrip.findOne({ _id: tripId, user: userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    Object.assign(trip, updateData);
    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating trip' });
  }
};

// Delete a traveler trip
exports.deleteTravelerTrip = async (req, res) => {
  try {
    const userId = req.user._id;
    const tripId = req.params.id;

    const trip = await TravelerTrip.findOneAndDelete({ _id: tripId, user: userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting trip' });
  }
};

// Get all active trips (for matching with parcels)
exports.getActiveTrips = async (req, res) => {
  try {
    const trips = await TravelerTrip.find({ status: 'Active' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching active trips' });
  }
};
