const express = require("express");
const multer = require("multer");
const Prescription = require("../models/prescription");
const auth = require("../middleware/auth");
const pharmacistAuth = require("../middleware/pharmacistAuth");
const mongoose = require("mongoose");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* =============================
   📤 Upload Prescription (User)
   ============================= */
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: "prescriptions" }
    );

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const prescription = new Prescription({
        userId: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        filename: req.file.originalname,
        originalname: req.file.originalname,
        type: "upload",
        status: "pending",
        date: new Date(),
      });

      await prescription.save();
      res.json({ message: "Prescription uploaded successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* =============================
   🧾 Get User Prescriptions
   ============================= */
router.get("/", auth, async (req, res) => {
  const prescriptions = await Prescription.find({
    userId: req.user._id,
  }).sort({ date: -1 });

  res.json(prescriptions);
});

/* =============================
   🏥 Get All Prescriptions (Pharmacist)
   ============================= */
router.get("/all", pharmacistAuth, async (req, res) => {
  const prescriptions = await Prescription.find().sort({ date: -1 });
  res.json(prescriptions);
});

/* =============================
   🖼️ Serve Prescription Image
   ============================= */
router.get("/image/:filename", async (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: "prescriptions" }
    );

    const stream = bucket.openDownloadStreamByName(req.params.filename);
    stream.on("error", () => res.status(404).send("File not found"));
    stream.pipe(res);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/* =============================
   ✅ Confirm Prescription (Pharmacist)
   ============================= */
router.put("/:id/confirm", pharmacistAuth, async (req, res) => {
  try {
    const { allPresent, medicines } = req.body;

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.status = "confirmed";
    prescription.confirmation = {
      allPresent,
      medicines,
      confirmedBy: req.pharmacist._id,
      confirmedAt: new Date(),
    };

    await prescription.save();
    res.json({ message: "Confirmed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =============================
   💊 Manual Medicine Request (User)
   ============================= */
router.post("/manual", auth, async (req, res) => {
  const { medicines } = req.body;

  if (!medicines || medicines.length === 0) {
    return res.status(400).json({ message: "Medicines required" });
  }

  const prescription = new Prescription({
    userId: req.user._id,
    userName: req.user.name,
    userEmail: req.user.email,
    medicines,
    type: "manual",
    status: "pending",
    date: new Date(),
  });

  await prescription.save();
  res.json({ message: "Manual request submitted" });
});

module.exports = router;
