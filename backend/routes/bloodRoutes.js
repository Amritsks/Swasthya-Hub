// backend/routes/bloodRoutes.js
const express = require("express");
const BloodRequest = require("../models/BloodRequest.js");
const Donation = require("../models/Donation.js");
const UserProfile = require("../models/UserProfile.js");

const router = express.Router();

// --------------------- GET all blood requests ---------------------
router.get("/", async (req, res) => {
  try {
    const requests = await BloodRequest.find();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
});

// --------------------- POST create a new blood request ---------------------
router.post("/request", async (req, res) => {
  try {
    const { group, units, locationName, lat, lng, requesterEmail } = req.body;

    if (!group || !units || !locationName || !requesterEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRequest = new BloodRequest({
      group,
      units,
      location: {
        name: locationName,
        lat: lat || null,
        lng: lng || null,
      },
      requester: requesterEmail,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json({ message: "Server error while creating request" });
  }
});

// --------------------- PUT accept a blood request ---------------------
router.put("/:requestId/accept", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { donorEmail, donorCode, donorName, donorPhone } = req.body;

    if (!donorEmail || !donorCode) {
      return res.status(400).json({ message: "Donor email and code are required" });
    }

    const request = await BloodRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "open") {
      return res.status(400).json({ message: "Request already accepted or completed" });
    }

    // Update blood request info
    request.status = "accepted";
    request.donor = donorEmail;
    request.donorName = donorName;
    request.donorPhone = donorPhone;
    request.donorCode = donorCode;
    const updatedRequest = await request.save();

    // Create a donation record
    const donation = new Donation({
      request: requestId,
      donor: donorEmail,
      receiver: request.requester,
      status: "pending",
      confirmationCode: donorCode,
    });
    await donation.save();

    res.json({
      message: "Request accepted successfully",
      updatedRequest,
      donation,
    });
  } catch (err) {
    console.error("Accept error:", err);
    res.status(500).json({ message: "Server error while accepting request" });
  }
});

// --------------------- ✅ POST confirm donation (by requester) ---------------------
router.post("/confirmDonation/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await BloodRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Prevent re-confirmation
    if (request.status === "completed") {
      return res.status(400).json({ message: "Donation already confirmed" });
    }
    if (request.status !== "accepted") {
      return res.status(400).json({ message: "Request not yet accepted" });
    }

    // Generate donor code if missing
    const donorCode =
      request.donorCode ||
      "DONOR-" + Math.random().toString(36).substr(2, 8).toUpperCase();

    // Update request status
    request.status = "completed";
    request.donationConfirmed = true;
    request.donorCode = donorCode;
    await request.save();

    // Update matching donation record
    const donation = await Donation.findOne({ request: requestId });
    if (donation) {
      donation.status = "completed";
      donation.completedAt = new Date();
      await donation.save();
    }

    // ✅ Update donor's UserProfile with achievement
    let donorProfile = await UserProfile.findOne({ email: request.donor });
    if (!donorProfile) {
      donorProfile = new UserProfile({
        email: request.donor,
        achievements: [],
      });
    }

    const achievement = {
      title: "Blood Donation",
      date: new Date(),
      donorCode,
      location: request.location?.name || "Unknown Location",
    };

    donorProfile.achievements.push(achievement);
    await donorProfile.save();

    return res.status(200).json({
      message: "Donation confirmed and achievement added successfully!",
      donorCode,
      achievement,
    });
  } catch (err) {
    console.error("Donation confirmation error:", err);
    res.status(500).json({ message: "Server error while confirming donation" });
  }
});

module.exports = router;
