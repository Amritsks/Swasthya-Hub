const express = require("express");
const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const Donation = require("../models/Donation");
const Pharmacist = require("../models/pharmacist");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Get all blood requests
router.get("/requests", adminAuth, async (req, res) => {
  const requests = await BloodRequest.find();
  res.json(requests);
});

// Get all donations
router.get("/donations", adminAuth, async (req, res) => {
  const donations = await Donation.find().populate("request");
  res.json(donations);
});

// Get all pharmacists
router.get("/pharmacists", adminAuth, async (req, res) => {
  const pharmacists = await Pharmacist.find().select("-password");
  res.json(pharmacists);
});

module.exports = router;
