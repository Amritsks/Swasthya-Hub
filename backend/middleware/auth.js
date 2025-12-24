const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Pharmacist = require('../models/pharmacist');

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });

  const token = auth.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Example: check if payload type is pharmacist or user (customize as needed)
    if (payload.userId) {
      // For pharmacist use userId
      const pharmacist = await Pharmacist.findOne({ userId: payload.userId });
      if (!pharmacist) return res.status(401).json({ error: 'Invalid token' });
      req.pharmacist = pharmacist;
    } else if (payload.id) {
      // For existing users with id
      const user = await User.findById(payload.id);
      if (!user) return res.status(401).json({ error: 'Invalid token' });
      req.user = user;
    } else {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Auth failed' });
  }
};
