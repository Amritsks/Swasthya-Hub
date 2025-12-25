const mongoose = require('mongoose');
const Pharmacist = require('../models/pharmacist'); // adjust path as needed

mongoose.connect(`${process.env.MONGO_URI}/swasthya`);

const pharmacists = [
  { userId: "Amrit", password: "Amrit@123" },
  { userId: "Nishant", password: "Nishant@123" },
  { userId: "Dipu", password: "Dalla@123" }
];

(async () => {
  for (const user of pharmacists) {
    const exists = await Pharmacist.findOne({ userId: user.userId });
    if (!exists) {
      const pharmacist = new Pharmacist(user);
      await pharmacist.save();
      console.log(`Created pharmacist ${user.userId}`);
    } else {
      console.log(`UserId ${user.userId} already exists, skipping.`);
    }
  }
  console.log("All pharmacist creation attempts complete!");
  mongoose.disconnect();
})();
