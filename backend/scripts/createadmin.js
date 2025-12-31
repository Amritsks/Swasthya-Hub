const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

mongoose.connect(`${process.env.MONGO_URI}/swasthya`)
  .then(async () => {
    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    const admin = new Admin({
      email: "admin1@gmail.com",
      password: hashedPassword
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    mongoose.disconnect();
  })
  .catch(err => console.error("❌ Error:", err));
