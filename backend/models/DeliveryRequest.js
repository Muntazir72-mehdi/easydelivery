const mongoose = require('mongoose');

const crypto = require('crypto');

const deliveryRequestSchema = new mongoose.Schema({
  deliveryId: { type: String, unique: true, required: true, default: () => crypto.randomBytes(8).toString('hex') },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  from: { type: String, required: true },
  fromAddress: { type: String },
  to: { type: String, required: true },
  toAddress: { type: String },
  weight: { type: Number, required: true },
  deadline: { type: Date, required: true },
  cost: { type: Number, required: true },
  status: { type: String, enum: ['Posted', 'Requested', 'Approved', 'Picked Up', 'In Transit', 'Delivered'], default: 'Posted' },
  requestStatus: { type: String, enum: ['None', 'Requested', 'Approved', 'Rejected'], default: 'None' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  traveler: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  travelerTrip: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelerTrip' },
  statusTimestamps: {
    posted: { type: Date, default: Date.now },
    requested: { type: Date },
    approved: { type: Date },
    pickedUp: { type: Date },
    inTransit: { type: Date },
    delivered: { type: Date }
  },
  deliveryPath: [{
    location: { type: String },
    estimatedTime: { type: Number }, // in minutes
    status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'] }
  }],
  totalEstimatedTime: { type: Number }, // total time in minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryRequest', deliveryRequestSchema);
