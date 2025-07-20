const mongoose = require('mongoose');

const deliveryRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  from: { type: String, required: true },
  to: { type: String, required: true },
  weight: { type: Number, required: true },
  deadline: { type: Date, required: true },
  cost: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryRequest', deliveryRequestSchema);
