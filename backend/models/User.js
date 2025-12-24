// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    bloodGroup: { type: String },
    height: { type: String },
    weight: { type: String },
    allergies: { type: String },
    medicalConditions: { type: String },
    medications: { type: String },
    fathername: { type: String },
    mothername: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
    },

    // ✅ New field: Blood Donation Achievements
    achievements: [
      {
        title: { type: String, default: "Blood Donation" },
        date: { type: Date, default: Date.now },
        donorCode: { type: String },
        location: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
