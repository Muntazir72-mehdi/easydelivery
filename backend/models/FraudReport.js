const mongoose = require('mongoose');

const fraudReportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  delivery: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryRequest', required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('FraudReport', fraudReportSchema);
