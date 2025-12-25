// migrateAddAchievements.js
const mongoose = require("mongoose");
const User = require("./models/User");

// 🔁 Replace with your MongoDB connection string
const MONGO_URI = `${process.env.MONGO_URI}swasthya`;

const migrateAchievements = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find users without achievements field
    const users = await User.find({ achievements: { $exists: false } });

    if (users.length === 0) {
      console.log("🎉 All users already have the 'achievements' field!");
      return process.exit(0);
    }

    // Add empty achievements array for all users missing it
    const updateResult = await User.updateMany(
      { achievements: { $exists: false } },
      { $set: { achievements: [] } }
    );

    console.log(
      `✅ Migration complete! Updated ${updateResult.modifiedCount} users.`
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrateAchievements();
