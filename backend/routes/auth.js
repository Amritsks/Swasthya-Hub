// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const router = express.Router();

// =========================
// REGISTER ROUTE
// =========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, bloodGroup, age } = req.body;

    // Trim values
    if (name) req.body.name = name.trim();
    if (email) req.body.email = email.trim();
    if (phone) req.body.phone = phone.trim();
    if (bloodGroup) req.body.bloodGroup = bloodGroup.trim();

    // Validation
    if (!name || !password || !bloodGroup || !age || (!email && !phone)) {
      return res
        .status(400)
        .json({ error: "Name, password, blood group, age and either email or phone are required" });
    }

    // Check if user exists (by email OR phone)
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email or phone" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      bloodGroup,
      age,
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// =========================
// LOGIN ROUTE
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Trim values
    if (email) req.body.email = email.trim();
    if (phone) req.body.phone = phone.trim();

    // Validation
    if ((!email && !phone) || !password) {
      return res.status(400).json({ error: "Provide email or phone and password" });
    }

    // Check user existence (by email OR phone)
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send only safe user info
    const { password: _, ...userData } = user._doc;

    return res.json({ token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;