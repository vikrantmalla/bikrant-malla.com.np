import mongoose from "mongoose";

const AboutMeDetailsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
  },
  aboutDescription1: {
    type: String,
  },
  aboutDescription2: {
    type: String,
  },
  skill1: {
    type: [String],
  },
  skill2: {
    type: [String],
  },
});

export default mongoose.models.Aboutme ||
  mongoose.model("Aboutme", AboutMeDetailsSchema);
