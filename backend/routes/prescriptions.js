const express = require("express");
const multer = require("multer");
const Prescription = require("../models/prescription");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

let bucket;

// Initialize GridFS for image uploads
mongoose.connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "prescriptions",
  });
});

/* =============================
   📤 Upload Prescription (Image)
   ============================= */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const { originalname, buffer, mimetype } = req.file;
    const { userName, userEmail } = req.body;

    if (!userName || !userEmail) {
      return res
        .status(400)
        .json({ message: "User name and email required" });
    }

    const uploadStream = bucket.openUploadStream(originalname, {
      contentType: mimetype,
    });

    uploadStream.end(buffer);

    uploadStream.on("finish", async () => {
      const newPrescription = new Prescription({
        originalname,
        filename: originalname,
        userName,
        userEmail,
        date: new Date(),
        status: "pending",
        type: "upload", // mark as uploaded
      });
      await newPrescription.save();
      res.json({
        message:
          "Prescription uploaded and stored in MongoDB GridFS successfully!",
      });
    });

    uploadStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to upload." });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload." });
  }
});

/* =============================
   🧾 Get all prescriptions (protected)
   ============================= */
router.get("/", auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      userId: req.user.id,
    });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch prescriptions." });
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
  const { allPresent, medicines } = req.body;
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    prescription.status = "confirmed";
    prescription.confirmation = { allPresent, medicines };
    await prescription.save();

    // Emit real-time notification if socket.io is active
    const io = req.app.get("io");
    if (io) {
      io.to(prescription.userEmail).emit("prescriptionConfirmed", {
        prescriptionId: prescription._id,
        allPresent,
        medicines,
        message: allPresent
          ? "All medicines available"
          : `Available medicines: ${medicines.join(", ")}`,
      });
    }

    res.json({
      message: "Prescription confirmed!",
      confirmed: prescription.confirmation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Prescription confirmation failed." });
  }
});

/* =============================
   💊 Manual Medicine Request (NEW)
   ============================= */
router.post("/manual", auth, async (req, res) => {
  try {
    const { medicines, userEmail, userName } = req.body;

    if (!medicines || medicines.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one medicine." });
    }

    // Create manual prescription entry
    const manualPrescription = new Prescription({
      userEmail: userEmail || req.user.email,
      userName: userName || req.user.name,
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
