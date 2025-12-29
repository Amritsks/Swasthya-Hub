const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mime = require("mime-types");
const Grid = require("gridfs-stream");
const http = require("http");
const { Server } = require("socket.io");

// Importing routes
const authRoutes = require("./routes/auth.js");
const bloodRequestRoutes = require("./routes/bloodRoutes.js");
const profileRoutes = require("./routes/profile.js");
const prescriptionRoutes = require("./routes/prescriptions");
const pharmacistAuthRoutes = require("./routes/pharmacistAuth.js");
const pharmacistDashboardRoutes = require("./routes/pharmacistDashboard");

// ✅ Newly added admin routes
const adminAuthRoutes = require("./routes/adminAuth.js");
const adminPanelRoutes = require("./routes/adminPanel.js");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup socket.io with proper CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);
  socket.on("identify", ({ userId }) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });
});

// Middleware
app.use(express.json());

// Global CORS config
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB connection and GridFS initialization
let gfs;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/swasthya";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const conn = mongoose.connection;
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("prescriptions");
    console.log("✅ MongoDB connected and GridFS initialized");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ==========================
// 🔗 ROUTE MIDDLEWARES
// ==========================
app.use("/api/auth", authRoutes); // user auth
app.use("/api/requests", bloodRequestRoutes); // blood requests
app.use("/api/profile", profileRoutes); // user profiles
app.use("/api/prescriptions", prescriptionRoutes); // prescriptions upload/view
app.use("/api/pharmacist", pharmacistDashboardRoutes); // pharmacist dashboard
app.use("/api/pharmacist-auth", pharmacistAuthRoutes); // pharmacist login

// ✅ Admin routes
app.use("/api/admin", adminAuthRoutes); // /api/admin/login & /api/admin/register
app.use("/api/admin-panel", adminPanelRoutes); // protected admin operations

// ==========================
// 🗂️ STATIC + FILE STREAMING
// ==========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Stream prescription images from GridFS
app.get("/api/prescriptions/image/:filename", (req, res) => {
  if (!gfs) {
    return res.status(500).send("GridFS not initialized");
  }

  const filename = req.params.filename;

  gfs.files.findOne({ filename }, (err, file) => {
    if (err) {
      console.error("Error finding file:", err);
      return res.status(500).send("Server error");
    }

    if (!file || file.length === 0) {
      return res.status(404).send("File not found");
    }

    const contentType =
      file.contentType || mime.lookup(file.filename) || "application/octet-stream";
    res.set("Content-Type", contentType);

    const readstream = gfs.createReadStream(file.filename);

    readstream.on("error", (err) => {
      console.error("Readstream error:", err);
      res.status(500).end("Error while streaming file");
    });

    readstream.pipe(res);
  });
});

// ==========================
// 🩺 HEALTH CHECK
// ==========================
app.get("/", (req, res) => {
  res.send("✅ Swasthya Hub Backend is running successfully!");
});

// ==========================
// ⚠️ GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ==========================
// 🚀 SERVER START
// ==========================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
