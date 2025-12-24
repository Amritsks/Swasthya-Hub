// backend/models/BloodRequest.js
const mongoose = require("mongoose");

const BloodRequestSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    location: {
      name: { type: String, required: true },
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
    requester: {
      type: String,
      required: true,
    },
    donor: {
      type: String,
      default: null,
    },
    donorName: {
      type: String,
      default: null,
    },
    donorPhone: {
      type: String,
      default: null,
    },
    donorCode: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "accepted", "completed"],
      default: "open",
    },
    meetingTime: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// TTL index: automatically delete document 24 hours after creation
BloodRequestSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
