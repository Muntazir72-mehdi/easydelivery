const mongoose = require('mongoose');

const travelerTripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  maxWeight: { type: Number, required: true }, // in kg
  availableWeight: { type: Number, required: true }, // remaining capacity
  costPerKg: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TravelerTrip', travelerTripSchema);
