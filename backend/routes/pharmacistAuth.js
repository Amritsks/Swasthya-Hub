const express = require("express");
const jwt = require("jsonwebtoken");
const Pharmacist = require("../models/pharmacist");

const router = express.Router();

// backend/routes/pharmacistAuth.js
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  const pharmacist = await Pharmacist.findOne({ userId });
  if (!pharmacist)
    return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await pharmacist.comparePassword(password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: pharmacist.userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, userId: pharmacist.userId });
});


module.exports = router;
