console.log("✅ adminPanelRoutes loaded");

const express = require("express");
const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const Donation = require("../models/Donation");
const Pharmacist = require("../models/pharmacist"); // ✅ FIXED
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ================= USERS =================
router.get("/users", adminAuth, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ================= REQUESTS =================
router.get("/requests", adminAuth, async (req, res) => {
  const requests = await BloodRequest.find();
  res.json(requests);
});

// ================= DONATIONS =================
router.get("/donations", adminAuth, async (req, res) => {
  const donations = await Donation.find().populate("request");
  res.json(donations);
});

// ================= PHARMACISTS (GET) =================
router.get("/pharmacists", adminAuth, async (req, res) => {
  const pharmacists = await Pharmacist.find().select("-password");
  res.json(pharmacists);
});

// ================= PHARMACISTS (CREATE) =================
router.post("/pharmacist", adminAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check by EMAIL (not userId)
    const exists = await Pharmacist.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Pharmacist already exists" });
    }

    // ✅ Create pharmacist
    const pharmacist = new Pharmacist({
      name,
      email,
      password, // assuming password hashing middleware already exists
    });

    await pharmacist.save();

    res.status(201).json({
      message: "Pharmacist created successfully",
      pharmacist,
    });
  } catch (err) {
    console.error("Create pharmacist error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
