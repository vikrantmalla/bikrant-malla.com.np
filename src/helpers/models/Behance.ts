import mongoose from "mongoose";

const BehanceHighlightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  tools: {
    type: [String],
    required: true,
  },
  projectview: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Behance ||
  mongoose.model("Behance", BehanceHighlightSchema);
