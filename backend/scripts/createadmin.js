const mongoose = require("mongoose");
const Admin = require("../models/Admin");

mongoose.connect(`${process.env.MONGO_URI}/swasthya`)
  .then(async () => {
    const admin = new Admin({
      email: "admin1@gmail.com",
      password: "Admin@1234"
    });
    await admin.save();
    console.log("✅ Admin created successfully!");
    mongoose.disconnect();
  })
  .catch(err => console.error("❌ Error:", err));
