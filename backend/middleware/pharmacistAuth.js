const jwt = require("jsonwebtoken");
const Pharmacist = require("../models/pharmacist");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const pharmacist = await Pharmacist.findById(decoded.id);
    if (!pharmacist) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.pharmacist = pharmacist;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
