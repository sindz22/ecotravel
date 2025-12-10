import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  dob: String,

  travelPreferences: [String],
  travelFrequency: String,
  ecoLevel: String,

  mobilityPreferences: [String],
  accommodationPreferences: [String],

  diet: String,
  allergies: String
});

export default mongoose.model("User", UserSchema);