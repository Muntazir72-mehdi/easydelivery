const DeliveryRequest = require('../models/DeliveryRequest');
const TravelerTrip = require('../models/TravelerTrip');
const Review = require('../models/Review');

// Get all delivery requests for the authenticated user
exports.getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const deliveries = await DeliveryRequest.find({ user: userId }).sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    console.error('Get all deliveries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new delivery request
exports.create = async (req, res) => {
  try {
    const { title, description, from, to, weight, cost, deadline } = req.body;
    const userId = req.user.id;

    // Create dummy delivery path with estimated times and statuses
    const deliveryPath = [
      { location: from, estimatedTime: 0, status: 'Pending' },
      { location: 'Checkpoint 1', estimatedTime: 30, status: 'Pending' },
      { location: 'Checkpoint 2', estimatedTime: 60, status: 'Pending' },
      { location: to, estimatedTime: 90, status: 'Pending' }
    ];
    const totalEstimatedTime = 90; // total time in minutes

    const newDelivery = new DeliveryRequest({
      title,
      description,
      from,
      to,
      weight,
      cost,
      deadline,
      user: userId,
      status: 'Posted',
      deliveryPath,
      totalEstimatedTime
    });

    await newDelivery.save();

    // Optionally, create dummy data for transit, delivered, pending statuses
    // This can be simulated by updating statusTimestamps or other fields if needed

    res.status(201).json(newDelivery);
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific delivery request by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await DeliveryRequest.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery request not found' });
    }
    res.json(delivery);
  } catch (error) {
    console.error('Get delivery by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a delivery request
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const delivery = await DeliveryRequest.findByIdAndUpdate(id, updates, { new: true });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery request not found' });
    }
    res.json(delivery);
  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a delivery request
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await DeliveryRequest.findByIdAndDelete(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery request not found' });
    }
    res.json({ message: 'Delivery request deleted successfully' });
  } catch (error) {
    console.error('Delete delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update delivery status by traveler
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Posted', 'Requested', 'Approved', 'Picked Up', 'In Transit', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const delivery = await DeliveryRequest.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery request not found' });
    }

    // Only allow status update by traveler if status flow is valid
    const currentIndex = validStatuses.indexOf(delivery.status);
    const newIndex = validStatuses.indexOf(status);
    if (newIndex !== currentIndex + 1) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    delivery.status = status;
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

// Get delivery history for the authenticated user
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const deliveries = await DeliveryRequest.find({
      $or: [
        { user: userId }, // deliveries requested by the user
        { traveler: userId } // deliveries done by the user as traveler
      ]
    }).sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    console.error('Get delivery history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get analytics for the authenticated user
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const deliveries = await DeliveryRequest.find({ user: userId });

    const totalDeliveries = deliveries.length;
    const completedDeliveries = deliveries.filter(d => d.status === 'Delivered').length;
    const totalEarnings = deliveries.reduce((sum, d) => sum + (d.status === 'Delivered' ? d.cost : 0), 0);

    const reviews = await Review.find({ reviewed: userId });
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    res.json({
      totalDeliveries,
      completedDeliveries,
      totalEarnings,
      averageRating: averageRating.toFixed(1)
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get smart match suggestions for travelers
exports.getSmartMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const userTrips = await TravelerTrip.find({ traveler: userId });

    const suggestions = [];

    for (const trip of userTrips) {
      const matchingDeliveries = await DeliveryRequest.find({
        from: trip.from,
        to: trip.to,
        status: 'Posted',
        user: { $ne: userId } // Exclude user's own deliveries
      }).populate('user', 'name');

      suggestions.push(...matchingDeliveries.map(d => ({
        delivery: d,
        trip: trip,
        matchScore: 100 // Simple match score, can be enhanced
      })));
    }

    res.json(suggestions);
  } catch (error) {
    console.error('Get smart matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
