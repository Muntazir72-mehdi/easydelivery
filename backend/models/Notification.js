const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'delivery', 'payment', 'system'],
    default: 'info',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedDelivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryRequest',
  },
  relatedTrip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelerTrip',
  },
  actionUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
