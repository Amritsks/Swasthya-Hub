// backend/models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
  donor: { type: String, required: true }, // Changed to String (email)
  receiver: { type: String, required: true }, // Changed to String (email)
  status: { type: String, enum: ['pending','completed'], default: 'pending' },
  confirmationCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);