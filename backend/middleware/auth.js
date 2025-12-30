const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pharmacist = require("../models/pharmacist");

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ PHARMACIST FIRST
    if (payload.role === "pharmacist") {
      const pharmacist = await Pharmacist.findById(payload._id);
      if (!pharmacist)
        return res.status(401).json({ error: "Pharmacist not found" });

      req.pharmacist = pharmacist;
      return next();
    }

    // ✅ USER
    if (payload.role === "user") {
      const user = await User.findById(payload._id);
      if (!user)
        return res.status(401).json({ error: "User not found" });

      req.user = user;
      return next();
    }

    return res.status(401).json({ error: "Invalid token role" });
  } catch (err) {
    return res.status(401).json({ error: "Auth failed" });
  }
};
