const DeliveryRequest = require('../models/DeliveryRequest');

// Get all delivery requests for a user
exports.getDeliveryRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await DeliveryRequest.find({ user: userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching delivery requests' });
  }
};

// Create a new delivery request
exports.createDeliveryRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, from, to, weight, deadline, cost, status } = req.body;

    const newRequest = new DeliveryRequest({
      user: userId,
      title,
      description,
      from,
      to,
      weight,
      deadline,
      cost,
      status: status || 'Pending'
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating delivery request' });
  }
};

// Update delivery request status or details
exports.updateDeliveryRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const requestId = req.params.id;
    const updateData = req.body;

    const request = await DeliveryRequest.findOne({ _id: requestId, user: userId });
    if (!request) {
      return res.status(404).json({ message: 'Delivery request not found' });
    }

    Object.assign(request, updateData);
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating delivery request' });
  }
};

// Delete a delivery request
exports.deleteDeliveryRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const requestId = req.params.id;

    const request = await DeliveryRequest.findOneAndDelete({ _id: requestId, user: userId });
    if (!request) {
      return res.status(404).json({ message: 'Delivery request not found' });
    }

    res.json({ message: 'Delivery request deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting delivery request' });
  }
};
