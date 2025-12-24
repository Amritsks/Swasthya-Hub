// backend/routes/profile.js
const express = require("express");
const UserProfile = require("../models/UserProfile.js");

const router = express.Router();

/**
 * GET /api/profile/:email
 * Fetch user profile by email
 */
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const profile = await UserProfile.findOne({ email });

    if (!profile) {
      // Return default empty profile structure if not found
      return res.json({
        email,
        name: "",
        age: "",
        gender: "",
        bloodGroup: "",
        height: "",
        weight: "",
        allergies: "",
        medicalConditions: "",
        medications: "",
        fathername: "",
        mothername: "",
        emergencyContact: {
          name: "",
          phone: "",
          relation: "",
        },
        achievements: [], // ✅ fixed (no undefined variable)
      });
    }

    // ✅ Ensure achievements always exist
    if (!profile.achievements) profile.achievements = [];

    res.status(200).json(profile);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * POST /api/profile/:email
 * Update or create profile by email
 */
router.post("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const profileData = req.body;
    profileData.email = email;

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { email },
      { $set: profileData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * POST /api/profile
 * Alternative endpoint using email in body
 */
router.post("/", async (req, res) => {
  try {
    const { email, ...profileData } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { email },
      { $set: { ...profileData, email } },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error("Profile save error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
