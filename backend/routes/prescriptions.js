const express = require("express");
const multer = require("multer");
const Prescription = require("../models/prescription");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const getBucket = () => {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "prescriptions",
  });
};


/* =============================
   📤 Upload Prescription (Image)
   ============================= */
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "User access only" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: "prescriptions" }
    );

    const { originalname, buffer, mimetype } = req.file;

    const uploadStream = bucket.openUploadStream(originalname, {
      contentType: mimetype,
    });

    uploadStream.end(buffer);

    uploadStream.on("finish", async () => {
      const newPrescription = new Prescription({
        userId: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        filename: originalname,
        originalname,
        type: "upload",
        status: "pending",
        date: new Date(),
      });

      await newPrescription.save();

      res.json({ message: "Prescription uploaded successfully" });
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS error:", err);
      res.status(500).json({ message: "GridFS upload failed" });
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});


/* =============================
   🧾 Get User Prescriptions
   ============================= */
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "User access only" });
    }

    const prescriptions = await Prescription.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch prescriptions." });
  }
});

// =============================
// 🏥 Get all prescriptions (Pharmacist only)
// =============================
router.get("/all", auth, async (req, res) => {
  if (!req.pharmacist) {
    return res.status(403).json({ message: "Pharmacist access only" });
  }

  try {
    const prescriptions = await Prescription.find().sort({ date: -1 });
    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
});


/* =============================
   🖼️ Serve Prescription Image
   ============================= */
router.get("/image/:filename", async (req, res) => {
  if (!bucket) return res.status(500).send("GridFSBucket not initialized");

  const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

  downloadStream.on("error", () => res.status(404).send("File not found"));

  res.set("Content-Type", "image/jpeg");
  downloadStream.pipe(res);
});

/* =============================
   ✅ Confirm Prescription (Pharmacist)
   ============================= */
router.put("/:id/confirm", auth, async (req, res) => {
  try {
    // 🔒 Pharmacist only
    if (!req.pharmacist) {
      return res.status(403).json({ message: "Pharmacist access only" });
    }

    const { allPresent, medicines = [] } = req.body;

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    prescription.status = "confirmed";
    prescription.confirmation = {
      allPresent: Boolean(allPresent),
      medicines: Array.isArray(medicines) ? medicines : [],
    };

    await prescription.save();

    // 🔔 Socket notification (safe)
    const io = req.app.get("io");
    if (io && prescription.userEmail) {
      io.to(prescription.userEmail).emit("prescriptionConfirmed", {
        prescriptionId: prescription._id,
        allPresent,
        medicines,
        message: allPresent
          ? "All medicines available"
          : medicines.length
          ? `Available medicines: ${medicines.join(", ")}`
          : "Some medicines are unavailable",
      });
    }

    res.json({
      message: "Prescription confirmed successfully",
      confirmed: prescription.confirmation,
    });
  } catch (err) {
    console.error("CONFIRM ERROR:", err);
    res.status(500).json({ message: "Prescription confirmation failed" });
  }
});


/* =============================
   💊 Manual Medicine Request (NEW)
   ============================= */
router.post("/manual", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "User access only" });
    }

    const { medicines } = req.body;

    if (!medicines || medicines.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one medicine." });
    }

    const manualPrescription = new Prescription({
      userId: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      medicines,
      type: "manual",
      date: new Date(),
      status: "pending",
    });

    await manualPrescription.save();

    res.status(201).json({
      message: "Manual medicine request submitted successfully!",
    });
  } catch (err) {
    console.error("Manual prescription error:", err);
    res
      .status(500)
      .json({ message: "Failed to submit manual medicine request." });
  }
});


module.exports = router;
