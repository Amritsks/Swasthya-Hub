const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescription');
const authMiddleware = require('../middleware/auth');

// Get logged-in pharmacist info
router.get('/me', authMiddleware, (req, res) => {
  res.json({ userId: req.pharmacist.userId }); // Adjust pharmacist user object accordingly
});

// Get prescriptions assigned to logged-in pharmacist
router.get('/prescriptions', authMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ pharmacistUserId: req.pharmacist.userId });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a prescription
router.put('/prescriptions/:id/accept', authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

    prescription.status = 'accepted';
    await prescription.save();
    res.json({ message: 'Prescription accepted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject a prescription
router.put('/prescriptions/:id/reject', authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

    prescription.status = 'rejected';
    await prescription.save();
    res.json({ message: 'Prescription rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
