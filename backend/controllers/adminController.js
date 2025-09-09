const User = require('../models/User');
const DeliveryRequest = require('../models/DeliveryRequest');
const TravelerTrip = require('../models/TravelerTrip');
const FraudReport = require('../models/FraudReport');
const Wallet = require('../models/Wallet');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Ban or unban a user
exports.toggleBanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isBanned = !user.isBanned;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Toggle ban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await DeliveryRequest.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    console.error('Get all deliveries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await TravelerTrip.find().populate('traveler', 'name email').sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Get all trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all fraud reports
exports.getAllFraudReports = async (req, res) => {
  try {
    const reports = await FraudReport.find().populate('reportedBy', 'name email').populate('delivery', 'title').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Get all fraud reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update fraud report status
exports.updateFraudReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const report = await FraudReport.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
    if (!report) {
      return res.status(404).json({ message: 'Fraud report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Update fraud report status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Management Functions

// Create a new user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign role to user
exports.assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Order Management Functions

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const orders = await DeliveryRequest.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders by status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign order to delivery agent
exports.assignOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const order = await DeliveryRequest.findByIdAndUpdate(id, { assignedAgent: agentId }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Assign order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await DeliveryRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delivery Agent Management Functions

// Get all delivery agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'Traveler' }).select('-password');
    res.json(agents);
  } catch (error) {
    console.error('Get all agents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify delivery agent
exports.verifyAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Verify agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get agent performance
exports.getAgentPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveries = await DeliveryRequest.find({ assignedAgent: id });

    const totalDeliveries = deliveries.length;
    const completedDeliveries = deliveries.filter(d => d.status === 'Delivered').length;
    const averageRating = deliveries.reduce((sum, d) => sum + (d.rating || 0), 0) / totalDeliveries || 0;

    res.json({
      totalDeliveries,
      completedDeliveries,
      completionRate: totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0,
      averageRating: averageRating.toFixed(1)
    });
  } catch (error) {
    console.error('Get agent performance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Payment & Transactions Functions

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const wallets = await Wallet.find().populate('user', 'name email');
    const transactions = wallets.flatMap(wallet =>
      wallet.transactions.map(t => ({
        ...t.toObject(),
        user: wallet.user
      }))
    );
    res.json(transactions);
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.balance += amount;
    wallet.transactions.push({
      type: 'credit',
      amount,
      description: `Refund: ${reason}`,
      date: new Date()
    });

    await wallet.save();
    res.json({ message: 'Refund processed successfully', wallet });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics & Reports Functions

// Get sales and revenue reports
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const deliveries = await DeliveryRequest.find(query);
    const totalRevenue = deliveries.reduce((sum, d) => sum + (d.status === 'Delivered' ? d.cost : 0), 0);
    const totalOrders = deliveries.length;
    const completedOrders = deliveries.filter(d => d.status === 'Delivered').length;

    res.json({
      totalRevenue,
      totalOrders,
      completedOrders,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get delivery performance metrics
exports.getDeliveryMetrics = async (req, res) => {
  try {
    const deliveries = await DeliveryRequest.find();
    const totalDeliveries = deliveries.length;
    const onTimeDeliveries = deliveries.filter(d => d.status === 'Delivered' && d.deliveredOnTime).length;
    const averageDeliveryTime = deliveries.reduce((sum, d) => sum + (d.deliveryTime || 0), 0) / totalDeliveries || 0;

    res.json({
      totalDeliveries,
      onTimeDeliveryRate: totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0,
      averageDeliveryTime: averageDeliveryTime.toFixed(2)
    });
  } catch (error) {
    console.error('Get delivery metrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get customer behavior insights
exports.getCustomerInsights = async (req, res) => {
  try {
    const users = await User.find({ role: 'Sender' });
    const insights = await Promise.all(users.map(async (user) => {
      const deliveries = await DeliveryRequest.find({ user: user._id });
      const reviews = await Review.find({ reviewed: user._id });

      return {
        user: user.name,
        totalOrders: deliveries.length,
        totalSpent: deliveries.reduce((sum, d) => sum + d.cost, 0),
        averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
      };
    }));

    res.json(insights);
  } catch (error) {
    console.error('Get customer insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Notifications & Alerts Functions

// Send notification to user
exports.sendNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    // For now, we'll just log the notification. In a real app, you'd integrate with a notification service
    console.log(`Notification sent to user ${userId}: ${message} (Type: ${type})`);

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get system alerts
exports.getSystemAlerts = async (req, res) => {
  try {
    // This would typically fetch alerts from a database or monitoring system
    const alerts = [
      { id: 1, message: 'High number of delayed deliveries', severity: 'warning', timestamp: new Date() },
      { id: 2, message: 'New fraud report submitted', severity: 'info', timestamp: new Date() }
    ];

    res.json(alerts);
  } catch (error) {
    console.error('Get system alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// System Settings Functions

// Get system settings
exports.getSystemSettings = async (req, res) => {
  try {
    // This would typically fetch settings from a database
    const settings = {
      deliveryZones: ['Zone A', 'Zone B', 'Zone C'],
      baseDeliveryCharge: 50,
      discountPercentage: 10,
      appVersion: '1.0.0',
      maintenanceMode: false
    };

    res.json(settings);
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update system settings
exports.updateSystemSettings = async (req, res) => {
  try {
    const updates = req.body;

    // This would typically update settings in a database
    console.log('System settings updated:', updates);

    res.json({ message: 'System settings updated successfully' });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
