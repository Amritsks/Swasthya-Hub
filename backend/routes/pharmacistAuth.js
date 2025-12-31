console.log("✅ Pharmacist auth routes loaded");

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Pharmacist = require("../models/pharmacist");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 🔍 find by EMAIL (NOT userId)
    const pharmacist = await Pharmacist.findOne({ email });
    if (!pharmacist) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔑 password check (IMPORTANT)
    const isMatch = await pharmacist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🎟️ JWT token
    const token = jwt.sign(
      {
        id: pharmacist._id,
        role: "pharmacist",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      pharmacist: {
        id: pharmacist._id,
        name: pharmacist.name,
        email: pharmacist.email,
      },
    });
  } catch (err) {
    console.error("Pharmacist login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
