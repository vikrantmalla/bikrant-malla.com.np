import mongoose from "mongoose";

const AboutMeDetailsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Aboutme ||
  mongoose.model("Aboutme", AboutMeDetailsSchema);
