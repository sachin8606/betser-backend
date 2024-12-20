const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  mediaUrl: { type: String },
  type: { type: String, enum: ['SMS', 'Push'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
