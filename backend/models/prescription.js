const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  // 🧾 For uploaded prescriptions
  filename: { type: String, default: null },
  originalname: { type: String, default: null },

  // 💊 For manual selections
  medicines: {
    type: [String], // array of medicine names
    default: [],    // empty array if it's an uploaded file
  },

  // 🔖 Common fields
  type: {
    type: String,
    enum: ["upload", "manual"],
    default: "upload",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },

  // 🧠 Pharmacist confirmation info
  confirmation: {
    allPresent: { type: Boolean, default: false },
    medicines: { type: [String], default: [] }, // confirmed/available medicines
  },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
