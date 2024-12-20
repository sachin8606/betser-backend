const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Emergency', 'General'], required: true },
  description: { type: String },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);
