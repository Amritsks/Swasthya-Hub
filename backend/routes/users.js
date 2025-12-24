import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  location: {
    lat: Number,
    lng: Number,
  },
});

export default mongoose.model("User", userSchema);
