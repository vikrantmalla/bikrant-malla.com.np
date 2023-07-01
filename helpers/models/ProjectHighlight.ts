import mongoose from "mongoose";

const ProjectHighlightSchema = new mongoose.Schema({
  title: {
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
  projectview: {
    type: String,
    required: true,
  },
  build: {
    type: [String],
    required: true,
  },
});

export default mongoose.models.Projecthighlights ||
  mongoose.model("Projecthighlights", ProjectHighlightSchema);
