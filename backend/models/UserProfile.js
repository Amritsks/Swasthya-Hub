// backend/models/UserProfile.js
const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  age: Number,
  gender: String,
  bloodGroup: String,
  height: String,
  weight: String,
  allergies: String,
  medicalConditions: String,
  medications: String,
  fathername: String,
  mothername: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },

  // ✅ NEW: Track user's donation achievements
  achievements: [
    {
      title: { type: String, default: "Blood Donation" },
      date: { type: Date, default: Date.now },
      donorCode: { type: String },
      location: { type: String },
    },
  ],
});

module.exports = mongoose.model("UserProfile", userProfileSchema);
